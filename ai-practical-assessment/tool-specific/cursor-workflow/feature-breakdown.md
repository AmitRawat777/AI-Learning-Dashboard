# Feature Specification — AI Learning Dashboard

## Goal

Build a frontend-heavy learning dashboard that lets users track tasks with owners, priorities, due dates, and progress visualization.

## Users

- **Learner** (alex.learner) — assigns tasks to self
- **Developer** (sam.developer) — project-focused tasks
- **Admin** — Drupal backend management only

## Features

### F1: Landing Page
- Hero section with animations (Lottie + SVG fallback)
- Feature highlights and tech stack
- CTA to dashboard

### F2: Dashboard Summary
- 5 stat cards: total, completed, in progress, overdue, high priority
- Animated count-up on load
- Lottie accent on welcome banner

### F3: Task Views
- **Kanban:** 3 columns (Planned, In Progress, Completed) with drag-and-drop
- **Grid:** responsive card layout
- Toggle via `?view=board|grid`

### F4: Task CRUD
- Create: `/tasks/new` — form with title, description, category, priority, status, owner, due date
- Read: task detail drawer on dashboard
- Update: `/tasks/:id/edit` — same form pre-filled
- Delete: not in v1 scope

### F5: Search & Filter
- Keyword search on title/description
- Status filter (all, planned, in progress, completed)
- URL-synced: `?search=` and `?status=`

### F6: UI States
- Loading, empty, error, success banners
- React ErrorBoundary for crash recovery

### F7: Backend API
- `GET/POST /api/tasks`, `GET/PATCH /api/tasks/{id}`
- `GET /api/tasks/summary`, `GET /api/users`
- Validation on create/update
- Seed data on module install

### F8: DevOps
- One-command DDEV setup
- Vite HMR on port 5173
- Admin user safeguard script

## Non-Goals (v1)

- User authentication in React app
- Task deletion
- Real-time collaboration
- Production deployment
- E2E browser tests

## Success Criteria

See [acceptance-criteria.md](acceptance-criteria.md) in this folder and root `acceptance-criteria.md`.
