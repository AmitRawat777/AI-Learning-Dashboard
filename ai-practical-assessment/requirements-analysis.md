# Requirement Analysis

## Selected Project Option

**Frontend-Heavy — AI Learning Dashboard / Project Tracker**

A React dashboard backed by Drupal that helps learners track goals, tasks, ownership, due dates, and progress.

## My Understanding (in your own words)

Users need a single place to see learning and project work at a glance: how many tasks are done, in progress, overdue, or high priority. They should be able to create and update tasks, assign owners, filter by status, search by keyword, and switch between kanban and grid views. Data must persist in a database (not in-memory) so tasks survive server restarts. The frontend should feel polished with loading, empty, error, and success states.

## Functional Requirements

- Landing page explaining the dashboard
- Dashboard with summary stat cards (total, completed, in progress, overdue, high priority)
- Task list with search and status filter (URL-synced query params)
- Kanban board with drag-and-drop status changes
- Grid view toggle
- Create task form (title, description, category, priority, status, owner, due date)
- View and edit existing tasks
- Owner dropdown populated from backend users API
- Data persisted via Drupal custom entity and REST endpoints

## Non-Functional Requirements

- One-command local setup via DDEV (`ddev start` or `./scripts/setup.sh`)
- TypeScript on frontend, PHP 8.3 on backend
- Responsive glassmorphism UI with animations (Framer Motion, Lottie)
- API responses in consistent JSON shape with validation errors
- Basic automated tests (Vitest integration + unit)
- README with setup instructions and default credentials

## Assumptions

- Local development only (DDEV); no production deployment required
- Anonymous users can access the dashboard API (local dev convenience)
- Seeded demo users (`alex.learner`, `sam.developer`) are sufficient for owner assignment
- Vite dev server on port 5173 proxies `/api` to Drupal
- Assessment reviewers use Docker + DDEV to run the project

## Clarifications (questions for a product owner)

1. Should task deletion be supported, or only create/update?
2. Is user authentication required for the React app, or is anonymous API access acceptable for the assessment?
3. Should overdue tasks trigger notifications, or is visual highlighting enough?
4. Is multi-user concurrent editing a concern for v1?

## Edge Cases

- Empty task list → show empty state with CTA to create first task
- API unreachable → show error banner with retry guidance
- Invalid form input → inline validation before submit
- Overdue tasks with `completed` status → not counted as overdue
- Drag kanban card to same column → no-op
- Search with no matches → empty filtered state
- Owner dropdown with long option list → portal-based menu to avoid z-index overlap
- Drupal admin missing after install → setup script ensures admin account exists
