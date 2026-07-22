#!/usr/bin/env bash
# Idempotent bootstrap — installs dependencies when the project is not ready yet.
# Called from git post-checkout, DDEV post-start, and optionally setup.sh.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

ensure_project_root
bash "${SCRIPT_DIR}/ensure-git-hooks.sh"

is_setup_complete() {
  if [[ ! -f "${PROJECT_ROOT}/.local/setup-complete" ]]; then
    return 1
  fi
  if ! has_vendor; then
    return 1
  fi
  if ! has_node_modules; then
    return 1
  fi
  if is_ddev_running && ! is_drupal_installed; then
    return 1
  fi
  if is_ddev_running && is_drupal_installed; then
    if ! ddev drush pm:list --status=enabled --format=string 2>/dev/null | grep -qw "ai_dashboard"; then
      return 1
    fi
  fi
  return 0
}

if is_setup_complete; then
  exit 0
fi

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  log_warn "Docker is required. Run ./setup.sh from the project root (it will guide installation)."
  exit 0
fi

if ! command -v ddev >/dev/null 2>&1; then
  log_warn "DDEV not found — run ./setup.sh to install DDEV and all dependencies automatically."
  exit 0
fi

export OPEN_BROWSER=0
if [[ -n "${DDEV_POST_START:-}" ]]; then
  export RUN_SETUP_NO_RESTART=1
fi

log_info "Project not fully bootstrapped — running automated setup"
bash "${SCRIPT_DIR}/setup.sh"
