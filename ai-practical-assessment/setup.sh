#!/usr/bin/env bash
# Convenience wrapper — run full setup from project root.
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/scripts/setup.sh" "$@"
