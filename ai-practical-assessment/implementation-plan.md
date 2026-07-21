# Implementation Plan

## Overview

Build a Drupal 11 + React monorepo with DDEV local environment. Drupal provides REST API and persistence via a custom `project_task` entity. React SPA consumes the API for dashboard, kanban, forms, and filters.

## Task Breakdown

| # | Task | Status |
|---|------|--------|
| 1 | DDEV project config + one-command setup script | Done |
| 2 | Drupal custom module `ai_dashboard` with entity + API | Done |
| 3 | Database seeding (users + sample tasks) | Done |
| 4 | React app scaffold (Vite, Router, TypeScript) | Done |
| 5 | API client layer (`src/api/`) | Done |
| 6 | Landing page + layout | Done |
| 7 | Dashboard summary cards | Done |
| 8 | Task list, search, status filter | Done |
| 9 | Kanban board with drag-and-drop | Done |
| 10 | Create/edit task forms with custom dropdowns | Done |
| 11 | Animations (Framer Motion, Lottie) | Done |
| 12 | Vitest unit + integration tests | Done |
| 13 | Assessment documentation artifacts | Done |
| 14 | Repository structure alignment (`src/`, `tests/`) | Done |

## Milestones

| Milestone | Target | Deliverable |
|-----------|--------|-------------|
| M1 — Environment | Day 1 | DDEV running, Drupal installed, API responding |
| M2 — Core CRUD | Day 2 | Create, list, update tasks from React |
| M3 — Dashboard UX | Day 2–3 | Summary, kanban, filters, animations |
| M4 — Quality | Day 3 | Tests, debugging notes, documentation |
| M5 — Submission | Day 4 | PR description, reflection, prompt history |

## AI Usage Plan

| Phase | AI role | Human validation |
|-------|---------|------------------|
| Planning | Draft requirements and acceptance criteria | Review against assessment brief |
| Design | Propose API shapes and component structure | Match to Drupal entity patterns |
| DevOps | Scaffold DDEV config and setup scripts | Run `ddev start`, verify URLs |
| Implementation | Generate React components and Drupal controllers | Lint, test, browser check |
| Debugging | Diagnose DDEV, z-index, admin login issues | Reproduce and confirm fix |
| Testing | Write integration test scaffolding | Run `npm test`, fix mocks |
| Review | Suggest improvements | Accept/reject with reasoning |
| Docs | Draft reflection and PR description | Edit for accuracy |

## Risks

| Risk | Impact |
|------|--------|
| DDEV not running → 404 on Vite URL | High — blocks demo |
| Wrong URL (no `:5173`) → Drupal instead of React | Medium — confusing for reviewers |
| Missing admin user after install | Medium — can't access Drupal admin |
| Dropdown z-index overlap in modals | Low — UX issue |
| AI suggests over-engineering | Medium — scope creep |

## Mitigation

- Document correct URLs prominently in README
- `scripts/ensure-drupal-admin.php` + setup step for admin account
- Portal-based dropdown menus for form selects
- Keep changes minimal; follow existing patterns
- Run tests and manual checks after each AI iteration
