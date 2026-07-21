# Task Breakdown — Traceability

## Spec → Implementation Map

| Task ID | Spec | Description | Files | Status |
|---------|------|-------------|-------|--------|
| T1 | F8 | DDEV config + setup scripts | `.ddev/config.yaml`, `scripts/setup.sh` | Done |
| T2 | F7 | Drupal `ai_dashboard` module | `backend/web/modules/custom/ai_dashboard/` | Done |
| T3 | F7 | ProjectTask entity | `Entity/ProjectTask.php` | Done |
| T4 | F7 | API controllers | `Controller/TaskApiController.php`, etc. | Done |
| T5 | F7 | Serializer + Validator | `Service/TaskSerializer.php`, `TaskValidator.php` | Done |
| T6 | F7 | Seed users + tasks | `ai_dashboard.install` | Done |
| T7 | F1 | Landing page | `src/src/pages/LandingPage.tsx` | Done |
| T8 | F1 | Hero animations | `src/src/components/animations/HeroVisual.tsx` | Done |
| T9 | F2 | Dashboard summary | `src/src/components/DashboardSummary.tsx` | Done |
| T10 | F2 | CountUp animation | `src/src/components/CountUp.tsx` | Done |
| T11 | F3 | Kanban board | `src/src/components/KanbanBoard.tsx` | Done |
| T12 | F3 | Grid view | `src/src/components/TaskList.tsx` | Done |
| T13 | F4 | Task form | `src/src/components/TaskForm.tsx` | Done |
| T14 | F4 | Custom dropdowns | `src/src/components/FormSelect.tsx` | Done |
| T15 | F5 | Search filter | `src/src/components/SearchFilter.tsx` | Done |
| T16 | F5 | URL query sync | `src/src/pages/DashboardPage.tsx` | Done |
| T17 | F6 | UI states | `src/src/components/StateMessages.tsx` | Done |
| T18 | F6 | Error boundary | `src/src/components/ErrorBoundary.tsx` | Done |
| T19 | — | API client | `src/src/api/client.ts`, `tasks.ts`, `users.ts` | Done |
| T20 | — | TypeScript types | `src/src/types/task.ts` | Done |
| T21 | — | Unit tests | `tests/summary.test.ts` | Done |
| T22 | — | Integration tests | `tests/App.integration.test.tsx` | Done |
| T23 | F8 | Admin user fix | `scripts/ensure-drupal-admin.php` | Done |
| T24 | — | Assessment docs | Root `*.md` files | Done |
| T25 | — | Repo structure | `src/`, `tests/` rename | Done |

## Iteration History

| Iteration | Task | Change |
|-----------|------|--------|
| 1 | T14 | Native `<select>` → custom FormSelect |
| 2 | T14 | Z-index fix → portal-based menu |
| 3 | T23 | Admin user missing → ensure script |
| 4 | T25 | `frontend/` → `src/`, tests to root |
| 5 | T24 | All assessment artifacts created |

## Traceability

```
requirements-analysis.md → spec.md → tasks.md → src/ + backend/ → tests/ → acceptance-criteria.md
```

Each task maps to a spec feature (F1–F8) and concrete file paths for reviewer verification.
