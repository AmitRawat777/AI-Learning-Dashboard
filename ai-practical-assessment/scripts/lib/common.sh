#!/usr/bin/env bash
#
# Shared helper functions for project setup scripts.
# Sourced by scripts/setup.sh — do not execute directly.
#

# Exit immediately on errors, unset variables, and pipeline failures.
set -euo pipefail

# ---------------------------------------------------------------------------
# Paths and defaults
# ---------------------------------------------------------------------------

# Resolve paths: this file lives in scripts/lib/, project root is two levels up.
_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_DIR="$(cd "${_LIB_DIR}/.." && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Default Drupal admin credentials (override via environment variables).
DRUPAL_ADMIN_USER="${DRUPAL_ADMIN_USER:-admin}"
DRUPAL_ADMIN_PASS="${DRUPAL_ADMIN_PASS:-admin}"
DRUPAL_SITE_NAME="${DRUPAL_SITE_NAME:-AI Practical Assessment}"

# Log file with timestamp for this setup run.
LOG_DIR="${PROJECT_ROOT}/scripts/logs"
mkdir -p "${LOG_DIR}"
LOG_FILE="${LOG_DIR}/setup-$(date +%Y%m%d-%H%M%S).log"

# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------

# Append a message to both stdout and the log file.
_log() {
  local level="$1"
  local message="$2"
  local timestamp
  timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
  echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_info()    { _log "INFO" "$1"; }
log_warn()    { _log "WARN" "$1"; }
log_error()   { _log "ERROR" "$1"; }
log_success() { _log "SUCCESS" "$1"; }

# Print an error and exit with status 1.
die() {
  log_error "$1"
  exit 1
}

# ---------------------------------------------------------------------------
# Preflight checks
# ---------------------------------------------------------------------------

# Verify that a required command exists on the host PATH.
require_command() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    die "Required command '${cmd}' not found. Please install it and retry."
  fi
}

# Ensure we are running from the project root (or a subdirectory thereof).
ensure_project_root() {
  cd "${PROJECT_ROOT}"
  if [[ ! -f "${PROJECT_ROOT}/.ddev/config.yaml" ]]; then
    die "Cannot find .ddev/config.yaml. Run this script from the project root."
  fi
}

# ---------------------------------------------------------------------------
# DDEV / Drupal state checks
# ---------------------------------------------------------------------------

# Return 0 if DDEV reports the project as running.
is_ddev_running() {
  local status
  status="$(ddev describe -j 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    raw = data.get('raw', {})
    if raw.get('status') == 'running':
        sys.exit(0)
    for svc in raw.get('services', {}).values():
        if svc.get('status') == 'running':
            sys.exit(0)
    sys.exit(1)
except Exception:
    sys.exit(1)
" 2>/dev/null && echo running || echo stopped)"
  if [[ "${status}" == "running" ]]; then
    return 0
  fi
  # DDEV v1.25+ shows service health as "OK" instead of "running".
  ddev describe 2>/dev/null | grep -qE "│ web[[:space:]]+│ OK[[:space:]]+│" && return 0
  return 1
}

# Return 0 if Drupal bootstrap is successful inside DDEV.
is_drupal_installed() {
  local bootstrap
  bootstrap="$(ddev drush status --fields=bootstrap --format=string 2>/dev/null || echo "")"
  [[ "${bootstrap}" == "Successful" ]]
}

# Return 0 if config/sync contains at least one YAML file.
has_config_sync() {
  local count
  count="$(find "${PROJECT_ROOT}/config/sync" -maxdepth 1 -name '*.yml' 2>/dev/null | wc -l)"
  [[ "${count}" -gt 0 ]]
}

# Return 0 if a database dump file exists.
has_db_dump() {
  [[ -f "${PROJECT_ROOT}/database/dump.sql.gz" ]]
}

# Return 0 if src node_modules directory exists.
has_node_modules() {
  [[ -d "${PROJECT_ROOT}/src/node_modules" ]]
}

# Return 0 if Composer autoload exists at project root.
has_vendor() {
  [[ -f "${PROJECT_ROOT}/vendor/autoload.php" ]]
}

# ---------------------------------------------------------------------------
# Step runner
# ---------------------------------------------------------------------------

# Execute a labelled setup step. Arguments: label, function_name.
run_step() {
  local label="$1"
  local fn="$2"
  log_info ">>> ${label}"
  if "${fn}"; then
    log_success ">>> ${label} — done"
  else
    die ">>> ${label} — failed"
  fi
}

# ---------------------------------------------------------------------------
# Browser launcher
# ---------------------------------------------------------------------------

# Open a URL in the default browser where supported.
open_browser() {
  local url="$1"
  log_info "Opening browser: ${url}"

  # Prefer DDEV's cross-platform launcher when available.
  if command -v ddev >/dev/null 2>&1; then
    # ddev launch accepts a path suffix (e.g. ":5173").
    local path="${url#*://*/}"
    path="${path#*.ddev.site}"
    if [[ -n "${path}" && "${path}" != "${url}" ]]; then
      ddev launch "${path}" 2>/dev/null || true
      return
    fi
    ddev launch 2>/dev/null || true
    return
  fi

  # Fallback for common desktop environments.
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${url}" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "${url}" >/dev/null 2>&1 || true
  else
    log_warn "Could not auto-open browser. Visit: ${url}"
  fi
}

# ---------------------------------------------------------------------------
# URL helpers
# ---------------------------------------------------------------------------

# Print the primary DDEV URL (HTTPS).
get_ddev_url() {
  ddev describe -j 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get('raw', {}).get('primary_url', 'https://ai-practical-assessment.ddev.site'))
except Exception:
    print('https://ai-practical-assessment.ddev.site')
" 2>/dev/null || echo "https://ai-practical-assessment.ddev.site"
}

# Print the Vite dev server URL.
get_vite_url() {
  local base
  base="$(get_ddev_url)"
  # Strip trailing slash and append Vite port.
  echo "${base%/}:5173"
}

# Print a summary of application URLs and credentials.
print_summary() {
  local ddev_url vite_url
  ddev_url="$(get_ddev_url)"
  vite_url="$(get_vite_url)"

  echo ""
  echo "============================================================"
  echo "  AI Practical Assessment — Setup Complete"
  echo "============================================================"
  echo ""
  echo "  Drupal backend:  ${ddev_url}"
  echo "  React frontend:   ${vite_url}"
  echo "  Dashboard app:    ${vite_url}/dashboard"
  echo "  Drupal admin:     ${ddev_url}/admin"
  echo "  JSON:API:         ${ddev_url}/jsonapi"
  echo "  Mailpit:          ${ddev_url}:8025"
  echo ""
  echo "  Admin username:   ${DRUPAL_ADMIN_USER}"
  echo "  Admin password:   ${DRUPAL_ADMIN_PASS}"
  echo ""
  echo "  Log file:         ${LOG_FILE}"
  echo "============================================================"
  echo ""
}
