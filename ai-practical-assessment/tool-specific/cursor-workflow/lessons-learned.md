# Acceptance Criteria — Cursor Workflow

Derived from root [acceptance-criteria.md](../../acceptance-criteria.md). Use this checklist during Cursor-assisted development.

## Core Features

- [x] Landing page at `/` with navigation to dashboard
- [x] Dashboard at `/dashboard` with summary cards
- [x] Kanban board with drag-and-drop status changes
- [x] Grid view toggle (`?view=grid`)
- [x] Create task at `/tasks/new`
- [x] Edit task at `/tasks/:id/edit`
- [x] Search filter (`?search=`)
- [x] Status filter (`?status=`)
- [x] Owner dropdown from `/api/users`
- [x] Data persists in MariaDB

## Quality

- [x] TypeScript compiles (`npm run lint`)
- [x] Tests pass (`npm test` — 7/7)
- [x] Loading, empty, error, success UI states
- [x] ErrorBoundary catches render errors
- [x] Portal dropdowns visible in modal forms

## DevOps

- [x] `ddev start` bootstraps project
- [x] `./scripts/setup.sh` is idempotent
- [x] Vite on port 5173 with HMR
- [x] Admin user exists after setup
- [x] README documents correct URLs

## Documentation

- [x] All required root markdown files
- [x] `ai-prompts/` with prompt history
- [x] `tool-specific/cursor-workflow/` complete
- [x] `database/setup-notes.md` with schema
- [x] `api-contract.md` and `data-model.md`

## Verification Commands

```bash
ddev start
ddev exec "cd /var/www/html/src && npm test"
ddev exec "cd /var/www/html/src && npm run lint"
curl -s https://ai-practical-assessment.ddev.site/api/tasks/summary
ddev drush user:information admin
```
