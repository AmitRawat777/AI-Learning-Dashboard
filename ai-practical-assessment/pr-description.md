# PR Description

## Summary

Full-stack AI Learning Dashboard: React 19 SPA with Drupal 11 REST API, DDEV one-command setup, kanban board, task CRUD, search/filter, animations, and Vitest tests. Repository aligned to assessment structure with complete documentation artifacts.

## Features Implemented

- Landing page with Lottie/SVG animations
- Dashboard with 5 summary stat cards (animated CountUp)
- Kanban board with drag-and-drop status changes
- Grid view toggle
- Task create/edit forms with premium glassmorphism UI and portal dropdowns
- Search and status filter (URL-synced)
- Loading, empty, error, and success UI states
- DDEV one-command setup with auto-bootstrap on `ddev start`

## Technical Changes

| Area | Changes |
|------|---------|
| **Frontend** (`src/`) | React + Vite + TypeScript, React Router 7, Framer Motion, Lottie |
| **Backend** (`backend/`) | Drupal 11 `ai_dashboard` module with `ProjectTask` entity |
| **API** | 6 REST endpoints (tasks CRUD, summary, users) |
| **DevOps** | DDEV config, setup scripts, Vite daemon, admin user safeguard |
| **Tests** (`tests/`) | 7 Vitest tests (2 unit, 5 integration) |
| **Docs** | All required assessment artifacts + Cursor workflow |

## Database Changes

- New entity table: `project_task`
- Custom roles: `learner`, `developer`
- Seeded users: `admin`, `alex.learner`, `sam.developer`
- Seeded tasks: 5 sample project tasks
- Install/update hooks in `ai_dashboard.install`

## Testing Done

```bash
ddev exec "cd /var/www/html/src && npm test"   # 7/7 pass
ddev exec "cd /var/www/html/src && npm run lint"  # tsc --noEmit pass
```

Manual: kanban drag, form dropdowns, DDEV URLs, Drupal admin login.

## AI Usage Summary

Cursor used across planning, design, implementation, debugging, testing, review, and documentation. See `ai-prompts/` for prompt history and `reflection.md` for lifecycle summary.

## Screenshots / Demo Notes

- Dashboard: `https://ai-practical-assessment.ddev.site:5173/dashboard`
- Create task: `https://ai-practical-assessment.ddev.site:5173/tasks/new`
- Drupal admin: `https://ai-practical-assessment.ddev.site/user/login` (`admin`/`admin`)

**Important:** React app requires port `:5173`. Without it, Drupal serves the default page.

## Known Limitations

- No task delete endpoint
- No React-side authentication (anonymous API access for local dev)
- No E2E browser tests (integration tests with mocks only)
- No backend PHPUnit tests
- Large `index.css` file (could be split in future refactor)

## Future Improvements

- Add Playwright E2E tests
- Task deletion with confirmation modal
- User authentication for production
- Export config to `config/sync/`
- Split CSS into modules
- Real-time updates via WebSocket or polling
