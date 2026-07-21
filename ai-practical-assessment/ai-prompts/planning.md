# Planning Prompts

Reconstructed prompt history for the AI Learning Dashboard project, based on the code, docs, and git-era fixes in this repository. Steps are ordered by dependency (what had to exist before what).

---

## Step 1 — Project scoping and mandatory requirements

**Prompt I would have given:**
> I'm building the Frontend-Heavy AI Learning Dashboard for a Drupal + React practical assessment. Read the brief: track learning goals and project tasks with owners, due dates, status, and a dashboard summary (total, completed, in progress, overdue, high priority). Data must persist in a database. I need requirements analysis, acceptance criteria, and an implementation plan. Stack: Drupal 11 backend, React SPA frontend, DDEV for local dev.

**AI response (summary):**
Proposed a monorepo with `backend/` (Drupal), React app, custom `project_task` entity, REST API, dashboard with summary cards, CRUD, search/filter, and UI states (loading/empty/error/success). Suggested milestones over ~4 days.

**Kept as-is:**
- Core feature list matching mandatory requirements (create, list, detail, update, summary, filter, persistence).
- Task entity field list: title, description, category, priority, status, ownerId, dueDate, createdAt, updatedAt.
- Seeded users only (not full user registration).

**Modified / corrected:**
- Added explicit acceptance criteria checklist with test requirements (create → list → update + dashboard counts).
- Narrowed scope: no task delete, no React auth, no production deploy. *(inferred from code — delete endpoint does not exist)*

**Why:**
Assessment rubric is explicit about mandatory vs stretch. Scoping early avoids over-engineering (no JSON:API, no Redux) that later code review notes reject.

**Artifacts produced:** `requirements-analysis.md`, `acceptance-criteria.md`, `implementation-plan.md`

---

## Step 2 — Data model definition

**Prompt I would have given:**
> Define the ProjectTask data model for Drupal 11: fields, enums, relationships to User, and how API JSON should look (camelCase for React). Include seeded users for the owner dropdown.

**AI response (summary):**
Content entity `project_task` with list_string enums for category/priority/status, entity reference for owner, datetime for due date, created/changed timestamps. Users: alex.learner (learner), sam.developer (developer). API adds computed `ownerName`, `isOverdue`, ISO date strings.

**Kept as-is:**
- Enum values in `ProjectTask.php` match `src/src/types/task.ts` exactly.
- Table name `project_task`, owner via `owner_id` FK.

**Modified / corrected:**
- Documented `isOverdue` as serializer-computed, not stored — logic: not completed + due date before end of today UTC (`TaskSerializer::isOverdue()`).
- Limited `/api/users` to seeded emails only via `ai_dashboard_seeded_user_emails()` in `ai_dashboard.module` — not all Drupal users. *(obvious from `UserApiController.php`)*

**Why:**
Owner dropdown should only show demo users from seed data, not uid 1 placeholder or admin account.

**Artifacts produced:** `data-model.md`, `database/setup-notes.md`, `database/schema-or-migrations/project_task.sql`

---

## Step 3 — API contract

**Prompt I would have given:**
> Write the REST API contract for: GET/POST /api/tasks, GET/PATCH /api/tasks/{id}, GET /api/tasks/summary, GET /api/users. Include request/response JSON, validation rules, and error shapes. Use camelCase in JSON.

**AI response (summary):**
Six endpoints with `{ data: ... }` wrappers, 422 for validation errors with `errors` array, query params `status` and `search` on list.

**Kept as-is:**
- Endpoint paths and methods in `ai_dashboard.routing.yml`.
- Response shape implemented in `TaskApiController`, `SummaryApiController`, `UserApiController`.

**Modified / corrected:**
- Chose custom REST controllers over JSON:API — simpler for assessment scope. *(documented in `implementation.md` and `reflection.md` as rejected AI suggestion)*
- List sorted by `changed DESC` (`TaskApiController::list`) — not specified in generic contract but sensible for dashboard.

**Why:**
Frontend `api/tasks.ts` expects simple fetch wrappers; JSON:API would add HAL parsing and different URL patterns.

**Artifacts produced:** `api-contract.md`

---

## Step 4 — Implementation plan and milestones

**Prompt I would have given:**
> Break the build into ordered tasks: DDEV setup → Drupal module → API → React scaffold → dashboard → kanban/forms → tests → docs. Include risks (wrong URL without :5173, DDEV bootstrap).

**AI response (summary):**
14-task table, 5 milestones (M1 env → M5 submission), AI usage plan per phase, risk/mitigation table.

**Kept as-is:**
- Dependency order: backend before frontend API client.
- Test milestone after core features.

**Modified / corrected:**
- Added later tasks for bug fixes (admin user, dropdown portal, bootstrap loop) as risks became real. *(inferred from `debugging-notes.md` — these weren't in original plan)*

**Why:**
Real development surfaced issues not visible in planning; plan was updated retroactively for assessment docs.

**Artifacts produced:** `implementation-plan.md`, `tool-specific/cursor-workflow/tasks.md`

---

## Step 5 — UI flow and page map

**Prompt I would have given:**
> Map routes and user flows: landing → dashboard, create task, edit task, task detail drawer, kanban vs grid, URL query params for filters.

**AI response (summary):**
Route table, flows for create/update/filter, query params: `status`, `search`, `view`, `task`, `highlight`.

**Kept as-is:**
- Routes in `App.tsx` match `ui-flow.md`.
- `/tasks/:id` redirects to `/dashboard?task={id}` via `TaskDetailRedirect.tsx` — drawer pattern instead of separate detail page.

**Modified / corrected:**
- Dual base paths `/dashboard` and `/tasks` share `DashboardPage` with `mode` prop — same UI, different nav highlight. *(obvious from `DashboardPage.tsx`)*

**Why:**
Avoid duplicating dashboard logic; "All Tasks" nav item still works.

**Artifacts produced:** `ui-flow.md`
