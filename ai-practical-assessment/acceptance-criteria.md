# Acceptance Criteria

## Mandatory Business Requirements (Core)

### Entities

| Entity | Fields | Status |
|--------|--------|--------|
| **User** (seeded) | `id`, `name`, `email`, `role` | ✅ `ai_dashboard.install`, `GET /api/users` |
| **ProjectTask** | `id`, `title`, `description`, `category`, `priority`, `status`, `ownerId`, `dueDate`, `createdAt`, `updatedAt` | ✅ `ProjectTask` entity + `TaskSerializer` |

### Features

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Create a task or project item | ✅ | `POST /api/tasks`, `/tasks/new`, `TaskForm` |
| View dashboard summary cards | ✅ | `DashboardSummaryCards`, `GET /api/tasks/summary` |
| List tasks | ✅ | `GET /api/tasks`, kanban + grid views |
| View task detail | ✅ | Task drawer via `?task=`, `TaskDetail` component |
| Update task fields (title, description, priority, status, owner, due date) | ✅ | `PATCH /api/tasks/{id}`, edit form |
| Update category | ✅ | Included in `TaskForm` + `TaskValidator` |
| Mark item in-progress or completed | ✅ | Kanban quick actions, drag-and-drop, task detail buttons |
| Keyword search **or** status filter | ✅ | Both: `SearchFilter`, `?search=`, `?status=` |
| Persist all data (survives restart) | ✅ | Drupal `project_task` entity in MariaDB |
| Validate required fields | ✅ | `TaskValidator.php` (backend) + `validateTaskInput()` (frontend) |
| Loading, empty, success, error states | ✅ | `StateMessages.tsx`, summary skeletons |

### Dashboard Summary (from real API data)

| Count | Status | Source |
|-------|--------|--------|
| Total items | ✅ | `SummaryApiController::summary()` |
| Completed items | ✅ | Counts `status === completed` |
| In-progress items | ✅ | Counts `status === in_progress` |
| Overdue items | ✅ | `TaskSerializer::isOverdue()` |
| High-priority items | ✅ | Counts `priority === high` |

Counts refresh after create/update via `loadData()` in `DashboardPage.tsx`.

### Mandatory Tests

| Test | Status | File |
|------|--------|------|
| Create → list → update flow | ✅ | `App.integration.test.tsx` |
| Dashboard counts update after create/update | ✅ | `expectStatCount` assertions in integration test |
| Required field validation | ✅ | `validation.test.ts` + integration test blocks empty submit |
| Mark in-progress quick action | ✅ | `App.integration.test.tsx` |
| Task detail view | ✅ | `App.integration.test.tsx` |
| Summary calculation unit test | ✅ | `summary.test.ts` |

Run: `ddev exec "cd /var/www/html/src && npm test"` (10 tests)

---

## Core

- [x] Landing page loads at `/` with project overview and navigation to dashboard
- [x] Dashboard loads at `/dashboard` with summary cards and task views
- [x] Summary shows total, completed, in progress, overdue, and high priority counts
- [x] Tasks can be created via `/tasks/new` with all required fields
- [x] Tasks can be viewed and edited from the dashboard
- [x] Kanban board supports drag-and-drop between status columns
- [x] Grid view available via `?view=grid`
- [x] Search filter works via `?search=` query param
- [x] Status filter works via `?status=` query param
- [x] Owner dropdown populated from `GET /api/users`
- [x] Data persists in MariaDB across DDEV restarts

## Validation

- [x] Title is required on create/update (frontend + backend)
- [x] Category, priority, status, and owner are required
- [x] Backend validates enum values (category, priority, status)
- [x] Invalid API input returns structured error response
- [x] Frontend shows validation feedback before submit and after API errors

## Error Handling

- [x] Loading state while fetching tasks/summary
- [x] Empty state when no tasks match filters
- [x] Error state when API call fails
- [x] React ErrorBoundary catches render errors
- [x] Success feedback after task create/update

## Testing

- [x] Unit test for summary calculation logic
- [x] Unit tests for required-field validation
- [x] Integration tests for dashboard load, create→update flow, filters, empty/error states
- [x] Integration test for mark in-progress and task detail
- [x] Tests runnable via `npm test` inside `src/`
- [x] Lottie mocked in test setup to avoid animation failures

## Documentation

- [x] README with one-command setup instructions
- [x] API contract documented in `api-contract.md`
- [x] Data model documented in `data-model.md`
- [x] Database setup notes in `database/setup-notes.md`
- [x] Prompt history in `ai-prompts/`
- [x] Cursor workflow artifacts in `tool-specific/cursor-workflow/`
- [x] Reflection and PR description completed
