#!/usr/bin/env bash
# Clone this repository and run full automated setup (recommended).
set -euo pipefail

usage() {
  echo "Usage: ./clone.sh <repository-url> [target-directory]"
  echo "Example: ./clone.sh https://github.com/org/ai-practical-assessment.git"
  exit 1
}

[[ $# -ge 1 ]] || usage

URL="$1"
DIR="${2:-ai-practical-assessment}"

git clone -c core.hooksPath=.githooks "${URL}" "${DIR}"
cd "${DIR}"

# Always run full setup (installs DDEV if needed).
bash scripts/setup.sh
