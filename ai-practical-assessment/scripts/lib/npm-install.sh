#!/usr/bin/env bash
# Install frontend npm dependencies inside DDEV (used by setup.sh and ddev post-start).
set -euo pipefail

FRONTEND_DIR="/var/www/html/src"
cd "${FRONTEND_DIR}"

if [[ ! -f package.json ]]; then
  echo "[npm-install] No src/package.json — skipping"
  exit 0
fi

if [[ -f package-lock.json ]]; then
  echo "[npm-install] Running npm ci from package-lock.json"
  npm ci --no-fund --no-audit
else
  echo "[npm-install] No lockfile — running npm install"
  npm install --no-fund --no-audit
fi

if [[ ! -f .env && -f .env.example ]]; then
  cp .env.example .env
  echo "[npm-install] Created src/.env from .env.example"
fi
