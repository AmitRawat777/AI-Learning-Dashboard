.DEFAULT_GOAL := setup

.PHONY: setup install start stop restart logs test

# Full automated setup after clone (idempotent). Running plain `make` does the same.
install: setup

setup:
	@chmod +x install.sh setup.sh clone.sh scripts/ensure-git-hooks.sh scripts/bootstrap-if-needed.sh scripts/ddev-post-start.sh scripts/lib/*.sh .githooks/* 2>/dev/null || true
	@bash scripts/ensure-git-hooks.sh
	@./scripts/setup.sh

start:
	ddev start

stop:
	ddev stop

restart:
	ddev restart

logs:
	ddev logs -f

test:
	ddev exec "cd /var/www/html/src && npm test"
