#!/usr/bin/env bash
#
# setup.sh — One-command local development environment setup.
#
# Usage (from project root):
#   ./scripts/setup.sh
#
# Environment variables:
#   DRUPAL_ADMIN_USER   Admin username (default: admin)
#   DRUPAL_ADMIN_PASS   Admin password (default: admin)
#   DRUPAL_SITE_NAME    Site name (default: AI Practical Assessment)
#   FORCE_DB_IMPORT=1   Re-import database/dump.sql.gz even if installed
#   OPEN_BROWSER=0      Skip auto-opening the browser
#
# This script is idempotent: safe to run multiple times.
#

set -euo pipefail

# Load shared helpers (logging, state checks, URL helpers).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

# Track whether this run performed a fresh Drupal install.
FRESH_INSTALL=false

# ---------------------------------------------------------------------------
# Error trap — log context on unexpected failure.
# ---------------------------------------------------------------------------
trap 'log_error "Setup failed at line ${LINENO}. See ${LOG_FILE} for details."' ERR

# ---------------------------------------------------------------------------
# Step implementations
# ---------------------------------------------------------------------------

step_preflight() {
  # Verify required host tools are available.
  require_command "ddev"
  require_command "docker"
  ensure_project_root
  log_info "Project root: ${PROJECT_ROOT}"
  return 0
}

step_start_ddev() {
  # Start (or ensure running) the DDEV containers.
  if [[ "${RUN_SETUP_NO_RESTART:-0}" == "1" ]]; then
    log_info "RUN_SETUP_NO_RESTART=1 — skipping ddev start (invoked from post-start hook)"
    return 0
  fi
  if is_ddev_running; then
    log_info "DDEV is already running — skipping ddev start"
  else
    ddev start 2>&1 | tee -a "${LOG_FILE}"
  fi
  return 0
}

step_composer_install() {
  # Install PHP dependencies if vendor/ is missing.
  if has_vendor; then
    log_info "backend/vendor/ exists — running composer install to sync"
  else
    log_info "backend/vendor/ missing — installing Composer dependencies"
  fi
  ddev composer install --working-dir=/var/www/html/backend --no-interaction 2>&1 | tee -a "${LOG_FILE}"
  return 0
}

step_drupal_install() {
  # Install Drupal only when the database has not been bootstrapped yet.
  if is_drupal_installed; then
    log_info "Drupal is already installed — skipping site:install"
    return 0
  fi

  log_info "Installing Drupal 11 (standard profile)"
  ddev drush site:install standard \
    --site-name="${DRUPAL_SITE_NAME}" \
    --account-name="${DRUPAL_ADMIN_USER}" \
    --account-pass="${DRUPAL_ADMIN_PASS}" \
    -y 2>&1 | tee -a "${LOG_FILE}"

  FRESH_INSTALL=true
  return 0
}

step_import_database() {
  # Import database dump on first install or when FORCE_DB_IMPORT=1.
  if ! has_db_dump; then
    log_info "No database/dump.sql.gz found — skipping import"
    return 0
  fi

  if [[ "${FORCE_DB_IMPORT:-0}" != "1" && "${FRESH_INSTALL}" != "true" ]]; then
    log_info "Database dump exists but site is already installed — skipping import"
    log_info "Set FORCE_DB_IMPORT=1 to force re-import"
    return 0
  fi

  log_info "Importing database from database/dump.sql.gz"
  ddev import-db --file="${PROJECT_ROOT}/database/dump.sql.gz" 2>&1 | tee -a "${LOG_FILE}"
  return 0
}

step_drupal_update() {
  # Run pending database updates (safe on every run).
  log_info "Running database updates"
  ddev drush updatedb -y 2>&1 | tee -a "${LOG_FILE}" || log_warn "updatedb returned non-zero (may be expected on fresh install)"
  return 0
}

step_config_import() {
  # Import configuration from config/sync when YAML files are present.
  if ! has_config_sync; then
    log_info "config/sync is empty — skipping config:import"
    return 0
  fi

  log_info "Importing configuration from config/sync"
  # config:import may report no changes; treat that as success.
  if ! ddev drush config:import -y 2>&1 | tee -a "${LOG_FILE}"; then
    log_warn "config:import returned non-zero — check config/sync for errors"
  fi
  return 0
}

step_ensure_admin_user() {
  # site:install can leave uid 1 as a placeholder without an administrator role.
  log_info "Ensuring Drupal admin account exists"
  DRUPAL_ADMIN_USER="${DRUPAL_ADMIN_USER}" \
  DRUPAL_ADMIN_PASS="${DRUPAL_ADMIN_PASS}" \
    ddev drush php:script /var/www/html/scripts/ensure-drupal-admin.php 2>&1 | tee -a "${LOG_FILE}"
  return 0
}

step_enable_custom_modules() {
  # Enable every custom module found in web/modules/custom/.
  local custom_dir="${PROJECT_ROOT}/backend/web/modules/custom"
  local enabled_any=false

  if [[ ! -d "${custom_dir}" ]]; then
    log_info "No custom modules directory — skipping"
    return 0
  fi

  for module_path in "${custom_dir}"/*/; do
    [[ -d "${module_path}" ]] || continue
    local module_name
    module_name="$(basename "${module_path}")"

    # Skip if already enabled.
    if ddev drush pm:list --status=enabled --format=string 2>/dev/null | grep -qw "${module_name}"; then
      log_info "Module '${module_name}' already enabled — skipping"
      continue
    fi

    log_info "Enabling custom module: ${module_name}"
    if ddev drush pm:enable "${module_name}" -y 2>&1 | tee -a "${LOG_FILE}"; then
      enabled_any=true
    else
      log_warn "Could not enable module '${module_name}'"
    fi
  done

  if [[ "${enabled_any}" == "false" ]]; then
    log_info "No new custom modules to enable"
  fi
  return 0
}

step_cache_clear() {
  # Rebuild Drupal caches.
  log_info "Clearing Drupal caches"
  ddev drush cache:rebuild -y 2>&1 | tee -a "${LOG_FILE}"
  return 0
}

step_frontend_install() {
  # Install all npm deps (lottie-react, react-router-dom, etc.) from package-lock.json.
  if has_node_modules; then
    log_info "src/node_modules exists — syncing dependencies"
  else
    log_info "src/node_modules missing — installing npm dependencies"
  fi
  ddev exec "bash /var/www/html/scripts/lib/npm-install.sh" 2>&1 | tee -a "${LOG_FILE}"
  return 0
}

step_restart_ddev() {
  if [[ "${RUN_SETUP_NO_RESTART:-0}" == "1" ]]; then
    log_info "RUN_SETUP_NO_RESTART=1 — skipping ddev restart"
    return 0
  fi
  # Restart DDEV to ensure Vite daemon and hooks are active.
  log_info "Restarting DDEV to activate Vite dev server daemon"
  ddev restart 2>&1 | tee -a "${LOG_FILE}"
  return 0
}

step_verify_services() {
  log_info "Verifying Vite and Drupal API"
  sleep 4

  if ddev exec "curl -sf -o /dev/null http://127.0.0.1:5173" 2>/dev/null; then
    log_success "Vite dev server is responding on :5173"
  else
    log_warn "Vite not ready yet — wait a few seconds or run: ddev restart"
  fi

  local api_code
  api_code="$(ddev exec "curl -sf -o /dev/null -w '%{http_code}' http://127.0.0.1/api/tasks/summary" 2>/dev/null || echo "000")"
  if [[ "${api_code}" == "200" ]]; then
    log_success "Drupal API /api/tasks/summary is responding"
  else
    log_warn "API check returned HTTP ${api_code} — try: ddev drush updatedb -y && ddev drush pm:enable ai_dashboard -y"
  fi
  return 0
}

step_launch_browser() {
  # Open Drupal and React URLs in the default browser.
  if [[ "${OPEN_BROWSER:-1}" == "0" ]]; then
    log_info "OPEN_BROWSER=0 — skipping browser launch"
    return 0
  fi

  local ddev_url vite_url
  ddev_url="$(get_ddev_url)"
  vite_url="$(get_vite_url)"

  # Brief pause to let Vite finish starting after restart.
  sleep 3

  open_browser "${ddev_url}"
  open_browser "${vite_url}"
  return 0
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  bash "${SCRIPT_DIR}/ensure-git-hooks.sh"

  log_info "=========================================="
  log_info "AI Practical Assessment — Setup starting"
  log_info "=========================================="

  run_step "Preflight checks"           step_preflight
  run_step "Start DDEV"                 step_start_ddev
  run_step "Composer install"           step_composer_install
  run_step "Drupal install"             step_drupal_install
  run_step "Import database"            step_import_database
  run_step "Enable custom modules"      step_enable_custom_modules
  run_step "Ensure admin user"          step_ensure_admin_user
  run_step "Database updates"           step_drupal_update
  run_step "Config import"              step_config_import
  run_step "Clear caches"               step_cache_clear
  run_step "Frontend npm install"       step_frontend_install
  run_step "Restart DDEV (Vite daemon)" step_restart_ddev
  run_step "Verify services"            step_verify_services

  print_summary

  run_step "Launch browser"             step_launch_browser

  mkdir -p "${PROJECT_ROOT}/.local"
  date -Iseconds > "${PROJECT_ROOT}/.local/setup-complete"

  log_success "Setup completed successfully."
}

main "$@"
