# Project Context — AI Learning Dashboard

## Overview

Full-stack learning/project task tracker built for the AI Practical Assessment.

| Layer | Technology | Location |
|-------|-----------|----------|
| Frontend | React 19, Vite 6, TypeScript | `src/` |
| Backend | Drupal 11, PHP 8.3 | `backend/web/modules/custom/ai_dashboard/` |
| Database | MariaDB 11.4 | DDEV container |
| Dev environment | DDEV | `.ddev/` |
| Tests | Vitest + Testing Library | `tests/` |

## Key URLs (local)

| Page | URL |
|------|-----|
| React app | `https://ai-practical-assessment.ddev.site:5173` |
| Dashboard | `https://ai-practical-assessment.ddev.site:5173/dashboard` |
| Drupal | `https://ai-practical-assessment.ddev.site` |
| Drupal admin | `https://ai-practical-assessment.ddev.site/user/login` |

**Critical:** React requires port `:5173`. Without it, nginx serves Drupal.

## Default Credentials

| User | Password | Role |
|------|----------|------|
| admin | admin | administrator |
| alex.learner | password | learner |
| sam.developer | password | developer |

## Architecture Decisions

1. **Custom REST API** over JSON:API — simpler for assessment scope
2. **Content entity** (`project_task`) — Drupal-native persistence
3. **URL query params** for filters — shareable, no global state library
4. **Anonymous API access** — local dev convenience only
5. **Portal dropdowns** — solve modal z-index stacking
6. **Fetch-on-mount** — no React Query/SWR dependency

## Code Conventions

- TypeScript strict mode on frontend
- camelCase JSON API responses
- CSS custom properties for theming (glassmorphism)
- Components in `src/src/components/`, pages in `src/src/pages/`
- API layer in `src/src/api/`
- Drupal services: Serializer, Validator pattern
- Setup scripts must be idempotent

## Commands

```bash
ddev start                          # Start environment
./scripts/setup.sh                  # Full setup
ddev exec "cd /var/www/html/src && npm test"   # Run tests
ddev drush uli --name=admin         # One-time admin login
```

## Current Status

All core features implemented. Assessment documentation complete. Repository aligned to required structure.
