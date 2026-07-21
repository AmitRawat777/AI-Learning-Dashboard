# Implementation Prompts

One entry per major build step, in dependency order. See also [devops-setup.md](devops-setup.md) for the full DDEV scaffold prompt.

---

## Step 1 — DDEV project scaffold

**Prompt:**
> Create a DDEV config for Drupal 11 + React (Vite). Docroot `backend/web`, Composer in `backend/`, MariaDB, PHP 8.3, Node 22. Expose Vite on port 5173 with a daemon. One-command setup script.

**AI response:**
`.ddev/config.yaml` with `web_extra_exposed_ports` and `web_extra_daemons` running `npm run dev` in frontend directory; `scripts/setup.sh` with idempotent steps.

**Kept:** DDEV type drupal11, Vite daemon, post-start npm install hook.

**Modified:** `frontend/` later renamed to `src/`; daemon path updated to `/var/www/html/src`. Added `bootstrap-if-needed.sh`, `RUN_SETUP_NO_RESTART`, `is_ddev_running()` OK-status fix. *(see debugging.md)*

**Why:** Auto-bootstrap on `ddev start` was required by assessment; loop fix was necessary for DDEV v1.25+.

**Files:** `.ddev/config.yaml`, `scripts/setup.sh`, `scripts/lib/common.sh`, `scripts/bootstrap-if-needed.sh`

---

## Step 2 — Drupal module shell and permissions

**Prompt:**
> Scaffold `ai_dashboard` custom module: info.yml, permissions.yml, services.yml, empty routing.

**AI response:**
Module metadata, dependency on user/datetime/text/options, permission `access ai dashboard api`.

**Kept:** Module structure under `backend/web/modules/custom/ai_dashboard/`.

**Modified:** Minimal surface — no contrib modules.

**Files:** `ai_dashboard.info.yml`, `ai_dashboard.permissions.yml`, `ai_dashboard.services.yml`

---

## Step 3 — ProjectTask content entity

**Prompt:**
> Create Drupal content entity `project_task` with fields: title, description, category, priority, status, owner_id, due_date, created, changed. Enums as documented in data model.

**AI response:**
`ProjectTask.php` with `baseFieldDefinitions()`, `ProjectTaskInterface`, `ProjectTaskAccessControlHandler`.

**Kept:** Field types and allowed_values match API contract.

**Modified:** `admin_permission` set to same API permission — unusual but works for local dev. *(obvious in entity annotation)*

**Files:** `src/Entity/ProjectTask.php`, `src/Entity/ProjectTaskInterface.php`, `src/ProjectTaskAccessControlHandler.php`

---

## Step 4 — TaskSerializer service

**Prompt:**
> Serialize ProjectTask to camelCase JSON for React. Include ownerName, ISO dates, isOverdue computed field.

**AI response:**
`TaskSerializer::toArray()`, `userToArray()`, `isOverdue()` with end-of-day UTC comparison.

**Kept:** Exact JSON shape used by `src/src/types/task.ts`.

**Modified:** `isOverdue` excludes completed tasks explicitly.

**Files:** `src/Service/TaskSerializer.php`

---

## Step 5 — TaskValidator service

**Prompt:**
> Validate create/update payloads before saving. Return human-readable error messages.

**AI response:**
`validateCreate()`, `validateUpdate()`, `apply()` with enum checks and `normalizeDate()`.

**Kept:** Mirrors mandatory required fields.

**Modified:** Separate `validate*` from `apply()` — controller calls both. 422 status in controller. *(obvious separation of concerns)*

**Files:** `src/Service/TaskValidator.php`, `src/Controller/TaskApiController.php`

---

## Step 6 — Task API controller (CRUD + list filters)

**Prompt:**
> Implement GET/POST /api/tasks and GET/PATCH /api/tasks/{id}. List supports ?status= and ?search= on title/description.

**AI response:**
`TaskApiController` with entity query, JSON decode, validation pipeline.

**Kept:** `{ data: [...] }` response wrapper.

**Modified:** Search uses LIKE with OR group; sort by `changed DESC`.

**Files:** `src/Controller/TaskApiController.php`, `ai_dashboard.routing.yml`

---

## Step 7 — Summary API controller

**Prompt:**
> GET /api/tasks/summary returns total, completed, inProgress, overdue, highPriority from all tasks in database.

**AI response:**
`SummaryApiController::summary()` loops entities and counts.

**Kept:** Counts from real DB data, not client-side aggregation in production UI.

**Modified:** Uses `TaskSerializer::isOverdue()` for overdue count — single source of truth.

**Files:** `src/Controller/SummaryApiController.php`

---

## Step 8 — Users API (seeded only)

**Prompt:**
> GET /api/users for owner dropdown — return id, name, email, role.

**AI response:**
Load active users, serialize with `userToArray()`.

**Kept:** Role = first non-authenticated role.

**Modified:** Filter `mail IN ai_dashboard_seeded_user_emails()` — only alex.learner and sam.developer, not admin. *(obvious from `UserApiController.php` + `ai_dashboard.module`)*

**Why:** Assessment says users are seeded only; dropdown shouldn't list every Drupal account.

**Files:** `src/Controller/UserApiController.php`, `ai_dashboard.module`

---

## Step 9 — Install hook and seed data

**Prompt:**
> On module install: grant API permission, create learner/developer roles, seed two users and five sample tasks with varied status/priority/due dates including one overdue.

**AI response:**
`hook_install()`, `_ai_dashboard_seed_users()`, `_ai_dashboard_seed_tasks()`.

**Kept:** Five tasks with relative `strtotime()` due dates in install hook.

**Modified:** Update hooks `9001` (entity table + re-seed if empty), `9002` (roles), `9003` (admin user safeguard). JSON files in `database/seed-data/` are reference only — actual seed is PHP. *(obvious — install hook doesn't read JSON)*

**Files:** `ai_dashboard.install`, `database/seed-data/*.json`

---

## Step 10 — React + Vite scaffold

**Prompt:**
> Create React 19 + Vite 6 + TypeScript app with React Router. Proxy /api to Drupal. Entry with ErrorBoundary.

**AI response:**
`package.json`, `vite.config.ts`, `main.tsx`, `App.tsx`, `index.html`.

**Kept:** StrictMode, ErrorBoundary wrapper, HMR config for DDEV (`host: 0.0.0.0`, `origin`, `wss` HMR).

**Modified:** Boot fallback message in `index.html` pointing to `:5173` URL.

**Files:** `src/package.json`, `src/vite.config.ts`, `src/src/main.tsx`, `src/index.html`

---

## Step 11 — TypeScript types and API client

**Prompt:**
> Define ProjectTask, TaskInput, DashboardSummary, User types matching API. Create fetch helpers with error handling.

**AI response:**
`types/task.ts`, `api/client.ts` with `ApiError`, `apiGet/Post/Patch`, `api/tasks.ts`, `api/users.ts`.

**Kept:** Label maps `STATUS_LABELS`, `PRIORITY_LABELS`, `CATEGORY_LABELS` for UI.

**Modified:** Relative URLs (no hardcoded host) — works with Vite proxy.

**Files:** `src/src/types/task.ts`, `src/src/api/*.ts`

---

## Step 12 — App layout and routing

**Prompt:**
> App shell with top nav (Dashboard, All Tasks, + New Task). Marketing layout for landing. Routes per ui-flow.md.

**AI response:**
`AppLayout.tsx`, `MarketingLayout`, routes in `App.tsx`.

**Kept:** `DashboardPage` shared for `/dashboard` and `/tasks` with `mode` prop.

**Files:** `src/src/components/layout/AppLayout.tsx`, `src/src/App.tsx`

---

## Step 13 — Landing page

**Prompt:**
> Marketing landing page explaining the learning dashboard with CTA to /dashboard.

**AI response:**
`LandingPage.tsx` with hero, features, tech stack section.

**Kept:** Basic structure.

**Modified:** Added Lottie/SVG animations later (`HeroVisual`, `KanbanDragDemo`, `FloatingOrbs`). *(LATER polish)*

**Files:** `src/src/pages/LandingPage.tsx`, `src/src/components/animations/*`

---

## Step 14 — Dashboard summary cards

**Prompt:**
> Five summary stat cards from GET /api/tasks/summary. Show loading skeleton. Animate numbers on load.

**AI response:**
`DashboardSummary.tsx` with stat grid, `CountUp.tsx`, `StatIcon.tsx`.

**Kept:** `data-testid={`stat-${key}`}` for tests.

**Modified:** Cards clickable — filter or switch view (`handleStatClick` in `DashboardPage`). Banner with Lottie accent repositioned to right side to avoid text overlap. *(from conversation history / review-fixes)*

**Files:** `src/src/components/DashboardSummary.tsx`, `CountUp.tsx`, `StatIcon.tsx`, `BannerLottieAccent.tsx`

---

## Step 15 — Dashboard page data loading and UI states

**Prompt:**
> DashboardPage: load tasks + summary, show LoadingState, EmptyState, ErrorState, SuccessBanner. Sync filters to URL.

**AI response:**
`useSearchParams`, debounced search reload, `StateMessages.tsx` components.

**Kept:** All four mandatory UI states.

**Modified:** 300ms debounce on search param changes. Success toast auto-dismiss 4s.

**Files:** `src/src/pages/DashboardPage.tsx`, `src/src/components/StateMessages.tsx`

---

## Step 16 — Search and status filter

**Prompt:**
> Filter bar: keyword search and status radio (all, planned, in progress, completed). Board/grid toggle.

**AI response:**
`SearchFilter.tsx` with controlled inputs bound to URL params.

**Kept:** Both search AND status filter (mandatory says "or" — implemented both).

**Modified:** Custom styled status pills instead of native radios. *(visual polish in CSS)*

**Files:** `src/src/components/SearchFilter.tsx`

---

## Step 17 — Task list grid view

**Prompt:**
> Grid alternative to kanban: responsive task cards with priority badge, owner, due date, quick status button.

**AI response:**
`TaskList.tsx` exporting `TaskCardGrid`.

**Kept:** Same callbacks as kanban: `onSelect`, `onEdit`, `onQuickStatus`.

**Files:** `src/src/components/TaskList.tsx`, `PriorityBadge.tsx`

---

## Step 18 — Kanban board with drag-and-drop

**Prompt:**
> Three-column kanban by status. Drag cards between columns to update status. Quick action button on each card.

**AI response:**
`KanbanBoard.tsx` with HTML5 DnD, column drop zones, `onQuickStatus` callback.

**Kept:** Column config planned / in_progress / completed.

**Modified:** Extensive hand-tuning — drag counters per column, `dropHandledRef`, custom drag image, portal drag cursor tip, exclude interactive elements from drag, `KanbanOnboardingHint` for first visit. *(obvious from code complexity vs naive DnD)*

**Files:** `src/src/components/KanbanBoard.tsx`, `KanbanOnboardingHint.tsx`, `TiltCard.tsx`

---

## Step 19 — Task detail drawer

**Prompt:**
> Slide-over drawer showing full task detail: description, owner, dates, priority. Buttons: Edit, Mark in progress, Mark completed.

**AI response:**
`TaskDetail.tsx` with framer-motion slide-in, meta dl, footer actions.

**Kept:** Conditional buttons based on current status.

**Modified:** Opened via `?task=` URL param not separate route. `TaskDetailRedirect` shim for `/tasks/:id`.

**Files:** `src/src/components/TaskDetail.tsx`, `TaskDetailRedirect.tsx`

---

## Step 20 — Task create and edit pages

**Prompt:**
> Pages at /tasks/new and /tasks/:id/edit wrapping a shared form. Load users for owner dropdown. Navigate back on success.

**AI response:**
`TaskPages.tsx` with `TaskCreatePage`, `TaskEditPage`.

**Kept:** Fetch users on mount; edit loads task by id.

**Modified:** Success navigates with location state for toast message.

**Files:** `src/src/pages/TaskPages.tsx`

---

## Step 21 — Task form (initial native selects)

**Prompt:**
> Modal form for create/update: title, description, category, priority, status, owner, due date. Validate required fields.

**AI response:**
`TaskForm.tsx` with sectioned layout, basic inputs and selects.

**Kept:** Section structure (Task details, Classification, Scheduling).

**Modified:** Replaced native `<select>` with custom `FormSelect` in later step.

**Files:** `src/src/components/TaskForm.tsx`

---

## Step 22 — Premium FormSelect component

**Prompt:**
> Replace native selects with premium glass dropdowns: icons, hints, animations, required indicators.

**AI response:**
`FormSelect.tsx` with framer-motion, trigger button, inline dropdown list, chevron rotation.

**Kept:** Generic `<T extends string | number>` API, option icons/hints.

**Modified:** **Portal rewrite** — menu renders to `document.body` with fixed position, backdrop, z-index 10100, scroll/resize listeners. First pass used inline menu with z-index CSS only — failed in modal. *(documented in debugging-notes.md)*

**Files:** `src/src/components/FormSelect.tsx`, `src/src/index.css` (form-select section)

---

## Step 23 — Client-side validation utility

**Prompt:**
> FormSelect doesn't support HTML5 required. Add validateTaskInput() before submit and show errors in the form.

**AI response:**
`validateTaskInput()` checking title, ownerId, category, priority, status.

**Kept:** Error list in `form-errors--premium` alert.

**Modified:** Comment explicitly links to `TaskValidator.php`. No due-date validation on client. *(obvious from file)*

**Files:** `src/src/utils/validateTask.ts`, updated `TaskForm.tsx`

---

## Step 24 — Lottie animations

**Prompt:**
> Add lottie-react to landing hero and dashboard welcome banner. Mock in tests.

**AI response:**
`LottiePlayer.tsx`, `HeroVisual.tsx`, `BannerLottieAccent.tsx`, assets in `public/lottie/`, `vi.mock('lottie-react')` in setup.

**Kept:** SVG fallback paths in animation components.

**Modified:** Repositioned banner Lottie to `hero-banner__visual` (right side). Restored after a revert pass. *(from review-fixes / conversation)*

**Files:** `src/src/components/animations/*`, `src/src/test/setup.ts`

---

## Step 25 — Vite redirect from Drupal

**Prompt:**
> Users visit /dashboard without :5173 and get Drupal 404. Add Drupal routes that redirect to Vite dev server.

**AI response:**
`ViteRedirectController` using `DDEV_PRIMARY_URL_WITHOUT_PORT` env var.

**Kept:** Routes for `/dashboard`, `/tasks`, `/tasks/{subpath}`.

**Modified:** Preserves query string on redirect.

**Files:** `src/Controller/ViteRedirectController.php`, routing.yml

---

## Step 26 — Admin user safeguard

**Prompt:**
> After install, admin user and administrator role are missing. Ensure admin exists on every setup run.

**AI response:**
`scripts/ensure-drupal-admin.php`, setup step, `ai_dashboard_update_9003`.

**Kept:** Defaults admin/admin, env override via `DRUPAL_ADMIN_USER/PASS`.

**Modified:** Creates administrator role with `is_admin: TRUE` if missing.

**Files:** `scripts/ensure-drupal-admin.php`, `ai_dashboard.install`, `setup.sh`

---

## Step 27 — Repository structure alignment (assessment)

**Prompt:**
> Align repo to required assessment structure: rename frontend to src, tests at root, create all mandatory .md artifacts and cursor-workflow folder.

**AI response:**
Move `frontend/` → `src/`, symlink `tests/` → `src/src/test`, write candidate-info, reflection, ai-prompts, etc.

**Kept:** Backend stays at `backend/` (needed for Drupal, not in template).

**Modified:** Tests canonical path is `src/src/test/`; root `tests/` is symlink. Vitest config points to `src/test/**`. *(obvious from vitest.config.ts)*

**Files:** Multiple root docs, `tool-specific/cursor-workflow/*`
