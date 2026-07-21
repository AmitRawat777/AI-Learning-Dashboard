# Database Setup Notes

## Overview

The AI Learning Dashboard stores all task data in Drupal's `project_task` custom entity table (MariaDB). Data persists across DDEV restarts.

## Structure

| Path | Purpose |
|------|---------|
| `dump.sql.gz` | Optional full database export (`ddev export-db`) |
| `schema-or-migrations/project_task.sql` | Documented entity table schema |
| `seed-data/users.json` | Demo user definitions (applied by install hook) |
| `seed-data/tasks.json` | Sample task definitions (applied by install hook) |
| `setup-notes.md` | This file |

## Entity: ProjectTask

| Field | Type | Required |
|-------|------|----------|
| id | auto | — |
| title | string | yes |
| description | text | no |
| category | enum | yes |
| priority | low / medium / high | yes |
| status | planned / in_progress / completed | yes |
| ownerId | user reference | yes |
| dueDate | date | no |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |

## Seeded users

Created by `ai_dashboard` module on install:

| Username | Email | Password |
|----------|-------|----------|
| admin | (Drupal install) | admin |
| alex.learner | alex.learner@example.com | password |
| sam.developer | sam.developer@example.com | password |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List tasks (`?status=`, `?search=`) |
| GET | `/api/tasks/{id}` | Task detail |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/{id}` | Update task |
| GET | `/api/tasks/summary` | Dashboard counts |
| GET | `/api/users` | Owner dropdown list |

## Commands

```bash
# Export database
ddev export-db --file=database/dump.sql.gz

# Re-seed (if no tasks exist)
ddev drush updatedb -y

# Check task count
ddev drush sql:query "SELECT COUNT(*) FROM project_task;"
```
