# Data Model

## Entity: ProjectTask

Drupal content entity (`project_task`) stored in table `project_task`.

| Field | DB column | Type | Required | Values |
|-------|-----------|------|----------|--------|
| id | id | int (auto) | — | Primary key |
| uuid | uuid | varchar | auto | Unique identifier |
| title | title | varchar(255) | yes | Task title |
| description | description | text | no | Long text |
| category | category | varchar | yes | `learning`, `project`, `research`, `other` |
| priority | priority | varchar | yes | `low`, `medium`, `high` |
| status | status | varchar | yes | `planned`, `in_progress`, `completed` |
| owner | owner_id | int | yes | FK → `users.uid` |
| due date | due_date | varchar | no | Date (`YYYY-MM-DD`) |
| created | created | int | auto | Unix timestamp |
| changed | changed | int | auto | Unix timestamp |

## Computed API Fields

Not stored in DB; calculated by `TaskSerializer`:

| Field | Logic |
|-------|-------|
| `ownerName` | Display name from referenced user |
| `createdAt` | ISO 8601 from `created` timestamp |
| `updatedAt` | ISO 8601 from `changed` timestamp |
| `isOverdue` | `due_date < today` AND `status != completed` |

## User Model

Standard Drupal users with custom roles:

| Username | Email | Role | Password (local) |
|----------|-------|------|------------------|
| admin | admin@example.com | administrator | admin |
| alex.learner | alex.learner@example.com | learner | password |
| sam.developer | sam.developer@example.com | developer | password |

## Dashboard Summary

Aggregated from all `project_task` records:

| Field | Calculation |
|-------|-------------|
| `total` | Count of all tasks |
| `completed` | `status === 'completed'` |
| `inProgress` | `status === 'in_progress'` |
| `overdue` | `isOverdue === true` |
| `highPriority` | `priority === 'high'` |

## TypeScript Mirror

Frontend types in `src/src/types/task.ts`:

- `ProjectTask` — full task object
- `TaskInput` — create/update payload
- `DashboardSummary` — summary counts
- `User` — owner dropdown item

## Relationships

```
User (1) ──< (many) ProjectTask
```

Each task has exactly one owner (`owner_id` → `users.uid`).

## Seed Data

Defined in `database/seed-data/` and applied by `ai_dashboard.install` hooks. See [database/setup-notes.md](database/setup-notes.md).
