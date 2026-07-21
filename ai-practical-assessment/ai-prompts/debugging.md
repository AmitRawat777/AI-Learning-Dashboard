# Debugging Prompts

Reconstructed from `debugging-notes.md`, code patterns, and fixes visible in the repo.

---

## Debug 1 — Project not loading (404 / blank screen)

**Prompt:**
> The project won't load — I get 404 or a blank page. URL is https://ai-practical-assessment.ddev.site/dashboard

**AI response (summary):**
Check DDEV is running; React app is on port **5173** not 443; without `:5173` you hit Drupal. Run `ddev start`, use `https://ai-practical-assessment.ddev.site:5173/dashboard`.

**Kept:**
- README URL table with `:5173` emphasized.
- `index.html` boot fallback text pointing to correct URL.

**Modified / fixed:**
1. **DDEV stopped** — user must run `ddev start`. *(operational, not code)*
2. **Bootstrap infinite loop** — `post-start` hook ran `setup.sh` → `ddev start` → `post-start` again because `is_ddev_running()` returned false on DDEV v1.25+ (`OK` vs `running` status).
   - Fix: grep for `│ web │ OK │` in `common.sh`; `RUN_SETUP_NO_RESTART=1` when invoked from bootstrap.
3. Added `ddev dashboard` host command → `ddev launch :5173/dashboard`.

**Why:**
Loop made containers unstable; wrong URL is the most common "site broken" report.

**Files:** `scripts/lib/common.sh`, `scripts/bootstrap-if-needed.sh`, `.ddev/commands/host/dashboard`, `src/index.html`

---

## Debug 2 — Dropdown menu hidden behind form fields

**Prompt:**
> In the Create/Update Task modal, the Priority dropdown opens but options are hidden behind the Owner field below. Screenshot attached.

**AI response (summary) — attempt 1:**
Raise z-index on `.form-select__menu`, solid background, `form-field--select--open` class on parent.

**Kept:** Opaque menu background, open-state class.

**Modified / fixed — attempt 2 (what actually worked):**
Portal menu to `document.body` via `createPortal()`:
- Fixed position from `getBoundingClientRect()`
- `z-index: 10100`, backdrop overlay
- Reposition on scroll/resize
- **Root cause:** `motion.div` wrappers and modal stacking contexts trapped inline menu.

**Why:**
CSS z-index alone cannot escape a parent stacking context; portal is the correct fix.

**Files:** `FormSelect.tsx`, `index.css` (`.form-select__menu--portal`, `.form-select__backdrop`)

**Follow-up prompt:**
> Integration tests broke after FormSelect — selectOptions no longer works.

**Fix:** `pickFormSelect()` helper in tests (see testing.md Step 5).

---

## Debug 3 — Cannot login to Drupal admin

**Prompt:**
> I can't access /admin — "Access denied". I need Drupal admin for the assessment backend.

**AI response (summary):**
Checked database: uid 1 is `placeholder-for-uid-1`, no `admin` user, no `administrator` role. Drupal 11 install left no usable admin.

**Kept:** Manual fix via drush user:create + role grant.

**Modified / fixed (permanent):**
- `scripts/ensure-drupal-admin.php` — creates administrator role (`is_admin: TRUE`) and admin user from env vars.
- `step_ensure_admin_user` in `setup.sh` / `setup.ps1`.
- `ai_dashboard_update_9003` for existing databases.

**Why:**
README promised `admin`/`admin` but seed/install didn't guarantee it; reviewers need admin access.

**Files:** `scripts/ensure-drupal-admin.php`, `ai_dashboard.install`, `setup.sh`

---

## Debug 4 — TypeScript errors blocking lint *(inferred)*

**Prompt:**
> `npm run lint` fails with errors in KanbanBoard, CountUp, PriorityBadge, DashboardSummary.

**AI response (summary):**
Null guards, stricter prop types, animation value type fixes.

**Kept:** All fixes per `review-fixes.md`.

**Modified:** Hand-adjusted types rather than disabling strict mode. *(inferred — no `strict: false` change in tsconfig)*

**Why:** Assessment expects `tsc --noEmit` to pass.

**Files:** `KanbanBoard.tsx`, `CountUp.tsx`, `PriorityBadge.tsx`, `DashboardSummary.tsx`

---

## Debug 5 — Lottie overlapping banner text *(from review-fixes)*

**Prompt:**
> Lottie animation on dashboard welcome banner overlaps the left text.

**AI response (summary):**
Move Lottie into `hero-banner__visual` on the right with progress ring.

**Kept:** `BannerLottieAccent` inside visual column.

**Why:** Layout issue visible in browser, not caught by tests (Lottie mocked).

**Files:** `DashboardSummary.tsx`, CSS for `hero-banner__visual`

---

## Debug 6 — Vitest module resolution after tests/ rename *(inferred)*

**Prompt:**
> Tests fail after moving tests to root `tests/` folder — cannot find setup.ts or node_modules.

**AI response (summary):**
Vitest runs from `src/`; tests outside `src/` can't resolve deps. Use symlink `tests` → `src/src/test` or keep canonical path in `src/src/test/`.

**Kept:** Canonical tests in `src/src/test/`; root `tests/` symlink for assessment folder structure.

**Modified:** `vitest.config.ts` includes only `./src/test/**`.

**Why:** Assessment requires `tests/` at root; npm packages live in `src/node_modules/`.

**Files:** `tests` symlink, `src/vitest.config.ts`

---

## Debug 7 — Optimistic kanban status rollback *(inferred from code)*

**Not a separate prompt** — pattern in `DashboardPage.handleQuickStatus()`:
- Optimistically update local `tasks` state
- On API failure: `setError`, call `loadData()` to rollback

**Why:** Without rollback, failed PATCH would leave UI showing wrong column until refresh.

**Files:** `DashboardPage.tsx` lines ~138–157
