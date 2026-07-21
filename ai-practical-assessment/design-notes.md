# Design Notes

## Architecture Overview (frontend, backend, database)

```
Browser (React SPA on :5173)
    │  fetch /api/*
    ▼
Vite dev proxy → Drupal 11 (nginx + PHP)
    │  ai_dashboard module
    ▼
MariaDB (project_task table, users)
```

- **Frontend:** React 19 SPA in `src/`, served by Vite with HMR
- **Backend:** Drupal 11 custom module `ai_dashboard` in `backend/web/modules/custom/`
- **Database:** MariaDB via DDEV; `project_task` content entity table

## Frontend Design

| Area | Approach |
|------|----------|
| Routing | React Router 7 — `/`, `/dashboard`, `/tasks`, `/tasks/new`, `/tasks/:id/edit` |
| State | URL query params for filters (`status`, `search`, `view`); fetch-on-mount for API data |
| Components | Layout, DashboardSummary, KanbanBoard, TaskList, TaskForm, SearchFilter, FormSelect |
| Styling | CSS custom properties, glassmorphism, premium modal forms |
| Animations | Framer Motion page transitions; Lottie on landing and dashboard banner |
| API layer | `src/api/client.ts` (base fetch), `tasks.ts`, `users.ts` |
| Types | `src/types/task.ts` mirrors API JSON shape |

## Backend Design

| Component | Responsibility |
|-----------|----------------|
| `ProjectTask` entity | Content entity with title, description, category, priority, status, owner, due date |
| `TaskApiController` | CRUD endpoints for tasks |
| `SummaryApiController` | Dashboard aggregate counts |
| `UserApiController` | Owner dropdown user list |
| `TaskSerializer` | Entity → camelCase JSON |
| `TaskValidator` | Input validation with error messages |
| `ai_dashboard.install` | Seed users, roles, sample tasks; ensure admin account |

**Permission:** `access ai dashboard api` granted to anonymous + authenticated for local dev.

## Database Design

See [data-model.md](data-model.md) and [database/setup-notes.md](database/setup-notes.md).

- Entity table: `project_task`
- Users: Drupal `users_field_data` + custom roles (`learner`, `developer`)
- Seeding via install/update hooks (not raw SQL migrations)
- Optional `database/dump.sql.gz` for full DB export

## Validation Strategy

- **Backend:** `TaskValidator` checks required fields and enum values before save
- **Frontend:** HTML5 `required` + form state validation before API call
- **API errors:** `{ message, errors: { field: "..." } }` shape returned on 400

## Error Handling Strategy

| Layer | Approach |
|-------|----------|
| API | HTTP status codes (400 validation, 404 not found, 500 server) |
| Frontend fetch | `ApiError` class with status and message |
| UI | `StateMessages` for loading/empty/error/success banners |
| React | Top-level `ErrorBoundary` for uncaught render errors |

## Testing Strategy Link

See [test-strategy.md](test-strategy.md). Tests live in `tests/` at repository root; Vitest config in `src/vitest.config.ts`.
