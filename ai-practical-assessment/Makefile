.DEFAULT_GOAL := setup

.PHONY: setup start stop restart logs test

# Full automated setup after clone (idempotent). Running plain `make` does the same.
setup:
	@chmod +x scripts/setup.sh setup.sh clone.sh scripts/ensure-git-hooks.sh scripts/bootstrap-if-needed.sh scripts/lib/*.sh .githooks/* 2>/dev/null || true
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
	ddev exec "cd /var/www/html/frontend && npm test"
