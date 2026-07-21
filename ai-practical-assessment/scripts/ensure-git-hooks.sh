#!/usr/bin/env bash
# Register repo git hooks and ensure setup scripts are executable.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

chmod +x setup.sh 2>/dev/null || true
chmod +x scripts/setup.sh scripts/bootstrap-if-needed.sh scripts/ensure-git-hooks.sh scripts/ddev-post-start.sh 2>/dev/null || true
chmod +x scripts/lib/*.sh .githooks/* 2>/dev/null || true

if git rev-parse --git-dir >/dev/null 2>&1; then
  git config core.hooksPath .githooks
fi
