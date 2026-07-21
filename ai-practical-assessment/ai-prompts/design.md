# Design Prompts

Architecture and design decisions inferred from the codebase.

---

## Step 1 — Overall architecture

**Prompt I would have given:**
> Design the architecture for Drupal 11 + React dashboard: how does the SPA talk to the backend locally? Where does data live? Draw the flow from browser to database.

**AI response (summary):**
React SPA on Vite port 5173, proxy `/api` to Drupal nginx, custom `ai_dashboard` module, MariaDB `project_task` table, anonymous API access for local dev.

**Kept as-is:**
- Three-layer diagram in `design-notes.md`.
- Vite proxy config in `src/vite.config.ts` for `/api` and `/jsonapi`.

**Modified / corrected:**
- Added Drupal-side redirects (`ViteRedirectController`) so `/dashboard` without `:5173` still reaches React. *(LATER fix — `ai_dashboard.routing.yml` vite routes)*
- Dual URL story documented in README and `index.html` boot fallback.

**Why:**
Reviewers and candidates hit Drupal 404 when forgetting port 5173; redirect + docs reduce confusion.

---

## Step 2 — REST vs JSON:API

**Prompt I would have given:**
> Should I use Drupal JSON:API or custom REST endpoints for the React app?

**AI response (summary):**
JSON:API is the Drupal-native approach with filtering and relationships; alternatively custom controllers give full control over response shape.

**Kept as-is:**
- Custom REST controllers only — no JSON:API module in `composer.json`.

**Modified / corrected:**
- Rejected JSON:API. Thin controllers + `TaskSerializer` service for explicit camelCase JSON.

**Why:**
Assessment API contract is fixed and small; custom endpoints are easier to test and document. Stated in `reflection.md` and `code-review-notes.md`.

---

## Step 3 — Frontend state management

**Prompt I would have given:**
> How should the React app manage filters, view mode, and selected task — global store or local state?

**AI response (summary):**
Suggested React Query/SWR for server state + URL params for filters, or Redux for complex apps.

**Kept as-is:**
- URL query params as source of truth: `search`, `status`, `view`, `task`, `highlight` in `DashboardPage.tsx`.
- Fetch-on-mount via `useEffect` + `loadData()` — no external cache library.

**Modified / corrected:**
- Rejected Redux and React Query. Local `useState` for tasks/summary; refetch after mutations.

**Why:**
Mandatory scope doesn't need optimistic cache invalidation complexity; URL-synced filters are shareable and testable.

---

## Step 4 — Task detail UX: drawer vs page

**Prompt I would have given:**
> When user clicks a task on the kanban board, should we navigate to a detail page or show a drawer?

**AI response (summary):**
Options: full page at `/tasks/:id`, modal, or slide-over drawer. Drawer keeps board context.

**Kept as-is:**
- Slide-over `TaskDetail` drawer; `?task=` query param opens it.
- `TaskDetailRedirect` for legacy `/tasks/:id` URLs.

**Modified / corrected:**
- Drawer fetches fresh task via `fetchTask(id)` when `taskIdParam` changes — not only list cache.

**Why:**
Ensures detail shows latest data after quick status update from board.

---

## Step 5 — Kanban vs grid

**Prompt I would have given:**
> Design task views: kanban board by status and optional grid. How does status change work?

**AI response (summary):**
Three columns, drag-and-drop between statuses, optional grid cards, quick action buttons per card.

**Kept as-is:**
- `KanbanBoard` + `TaskCardGrid` in `TaskList.tsx`.
- Toggle via `?view=board|grid` in `SearchFilter.tsx`.
- Drag uses custom MIME `application/x-learntrack-task-id` and column drop handlers.

**Modified / corrected:**
- Hand-tuned drag: exclude interactive targets (title button, edit, quick action) from drag start via `isInteractiveDragTarget()`. *(obvious from `KanbanBoard.tsx` — beyond naive HTML5 DnD)*
- Optimistic UI in `handleQuickStatus()` with rollback on API failure. *(inferred intent from try/catch + `loadData()` on error)*

**Why:**
Native drag on whole card breaks click-to-open and button clicks; optimistic updates feel responsive.

---

## Step 6 — UI theme and glassmorphism

**Prompt I would have given:**
> The dashboard should feel premium: glass cards, dark theme, subtle animations. No Tailwind — use CSS custom properties to match a cohesive design.

**AI response (summary):**
CSS variables for colors, glass panels, modal styling, kanban columns, form fields. Framer Motion for page transitions.

**Kept as-is:**
- Large `src/src/index.css` with sections for layout, kanban, modal, form-select, stats.
- `framer-motion` on cards, modals, page headers.

**Modified / corrected:**
- Rejected Tailwind rewrite when suggested in review (`code-review-notes.md`).
- Lottie added later for landing/dashboard accents — not in first design pass.

**Why:**
Existing CSS theme was established early; wholesale framework swap is high-risk for assessment timeline.

---

## Step 7 — Validation strategy (client + server)

**Prompt I would have given:**
> Where should validation live for task create/update? Required: title, category, priority, status, owner.

**AI response (summary):**
Backend validator service; frontend HTML5 `required` on inputs.

**Kept as-is:**
- `TaskValidator.php` with `validateCreate()`, `validateUpdate()`, `apply()`.
- 422 responses with `{ errors: string[] }`.

**Modified / corrected:**
- Added `validateTaskInput()` in `src/src/utils/validateTask.ts` because custom `FormSelect` buttons don't participate in native form validation. *(obvious — comment in file says "Mirrors TaskValidator.php")*
- Backend also validates date format; frontend does not — date is optional HTML5 `type="date"`.

**Why:**
Custom dropdowns bypass browser validation; assessment requires visible required-field enforcement.

---

## Step 8 — Permissions and local dev access

**Prompt I would have given:**
> Should the React app require Drupal login or can anonymous users hit the API?

**AI response (summary):**
Options: session auth, API key, or open API for local dev only.

**Kept as-is:**
- Single permission `access ai dashboard api` granted to anonymous + authenticated in `hook_install()`.
- Documented as local-dev-only in `design-notes.md`.

**Modified / corrected:**
- Did not implement React-side auth or CSRF tokens for API. *(inferred — no auth headers in `api/client.ts`)*

**Why:**
Assessment is frontend-heavy with DDEV-local scope; auth would distract from mandatory CRUD flows.
