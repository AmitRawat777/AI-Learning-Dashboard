#!/usr/bin/env bash
# Runs inside the DDEV web container on every `ddev start`.
# Installs Composer (vendor/, web/core/) and npm deps when missing.
set -euo pipefail

PROJECT_ROOT="/var/www/html"
FRONTEND_DIR="${PROJECT_ROOT}/src"

log() {
  echo "[ddev-post-start] $*"
}

if [[ ! -f "${PROJECT_ROOT}/composer.json" ]]; then
  log "ERROR: ${PROJECT_ROOT}/composer.json not found."
  log "Your clone may be incomplete — ensure composer.json is committed at the project root."
  exit 1
fi

if [[ ! -f "${PROJECT_ROOT}/vendor/autoload.php" ]]; then
  log "vendor/ missing — running composer install (creates vendor/ and web/core/)..."
  (
    cd "${PROJECT_ROOT}"
    composer install --no-interaction --prefer-dist
  )
  log "Composer install complete."
else
  log "vendor/ present — skipping composer install."
fi

if [[ -f "${FRONTEND_DIR}/package.json" ]]; then
  bash "${PROJECT_ROOT}/scripts/lib/npm-install.sh"
else
  log "No src/package.json — skipping npm install."
fi
