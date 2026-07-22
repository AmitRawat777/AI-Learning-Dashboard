#!/usr/bin/env bash
# Ensure Docker and DDEV exist before project setup (used by setup.sh).
# Set AUTO_INSTALL_DDEV=0 to skip automatic DDEV install.
set -euo pipefail

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    die "Docker is not installed.

Install Docker first, then re-run ./setup.sh:
  https://docs.docker.com/get-docker/

Linux: Docker Engine + Docker Compose plugin
macOS/Windows: Docker Desktop"
  fi

  if ! docker info >/dev/null 2>&1; then
    die "Docker is installed but not running. Start Docker Desktop (or the docker service), then re-run ./setup.sh."
  fi

  log_success "Docker is available"
}

ensure_ddev() {
  if command -v ddev >/dev/null 2>&1; then
    log_success "DDEV is available ($(ddev version 2>/dev/null | head -1 || echo installed))"
    return 0
  fi

  if [[ "${AUTO_INSTALL_DDEV:-1}" == "0" ]]; then
    die "DDEV is not installed. Install it, then re-run ./setup.sh:
  https://ddev.com/get-started/
  Linux/macOS: curl -fsSL https://ddev.com/install.sh | bash"
  fi

  log_info "DDEV not found — installing via https://ddev.com/install.sh (may prompt for sudo)..."
  if ! curl -fsSL https://ddev.com/install.sh | bash; then
    die "DDEV installation failed. Install manually: https://ddev.com/get-started/"
  fi

  export PATH="${HOME}/.ddev/bin:${PATH}"
  if ! command -v ddev >/dev/null 2>&1; then
    die "DDEV installed but not on PATH. Open a new terminal or run: export PATH=\"\${HOME}/.ddev/bin:\${PATH}\""
  fi

  log_success "DDEV installed successfully"
}
