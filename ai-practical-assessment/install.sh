#!/usr/bin/env bash
# One-command setup for fresh clones — installs DDEV (if needed), Docker check,
# Composer, Drupal, npm, Vite, and seed data.
#
# Usage (from project root after git clone):
#   ./install.sh
#
# Same as: ./setup.sh  or  make
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "${ROOT}/scripts/setup.sh" "$@"
