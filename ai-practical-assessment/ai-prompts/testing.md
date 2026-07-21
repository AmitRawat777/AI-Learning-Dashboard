# Testing Prompts

---

## Step 1 — Test strategy document

**Prompt:**
> Write test strategy for mandatory assessment tier: integration tests for create → list → update flow and dashboard counts. Document what's not covered and why.

**AI response:**
Vitest + Testing Library, mock API layer, unit test for summary logic, gaps table (no E2E, no backend PHPUnit).

**Kept:** Strategy structure in `test-strategy.md`.

**Modified:** Expanded to 14 tests after validation and quick-action tests added.

**Files:** `test-strategy.md`, `test-results.md`

---

## Step 2 — Vitest and test harness setup

**Prompt:**
> Configure Vitest with jsdom, globals, setup file. Mock lottie-react so animations don't break tests.

**AI response:**
`vitest.config.ts`, `setup.ts` with jest-dom and lottie mock, `renderWithRouter.tsx` with MemoryRouter.

**Kept:** `renderWithRouter` default entry `/dashboard`.

**Modified:** Config path adjusted after `frontend/` → `src/` rename; includes `./src/test/**/*.test.ts(x)` only. *(root `tests/` symlink not in vitest include — obvious from config)*

**Files:** `src/vitest.config.ts`, `src/src/test/setup.ts`, `src/src/test/renderWithRouter.tsx`

---

## Step 3 — Summary unit test (computeSummary)

**Prompt:**
> Unit test a function that computes dashboard summary counts from a task array — total, completed, inProgress, overdue, highPriority.

**AI response:**
`summary.ts` helper + `summary.test.ts` with mixed tasks and empty array cases.

**Kept:** Two test cases.

**Modified:** `computeSummary()` lives in test folder only — **not used in production**; real UI calls `fetchSummary()` from API. *(obvious — grep shows no import in components)* This is a mirror of backend logic for unit testing, not app code. Likely kept for quick unit coverage without API.

**Why:** Mandatory tests need count logic verification; duplicating logic in test helper is a trade-off vs testing `SummaryApiController` directly.

**Files:** `src/src/test/summary.ts`, `src/src/test/summary.test.ts`

---

## Step 4 — Integration test: dashboard load and counts

**Prompt:**
> Integration test: render dashboard, mock API, assert all five stat cards show correct numbers and task title appears.

**AI response:**
Test with `vi.spyOn` on `fetchTasks`/`fetchSummary`, `expectStatCount()` helper using `data-testid`.

**Kept:** Asserts total, completed, inProgress, overdue, highPriority.

**Modified:** `expectStatCount` uses `waitFor` for async render.

**Files:** `src/src/test/App.integration.test.tsx` (first test)

---

## Step 5 — Integration test: create → list → update flow

**Prompt:**
> Test full mandatory flow: open create form, submit task, see success, counts update to 2; edit task, change title and status to completed, counts show completed=1.

**AI response:**
Mock `createTask`, `updateTask`, chained `fetchTasks`/`fetchSummary` return values per call.

**Kept:** Core mandatory test tier.

**Modified:**
- Initially used `selectOptions` for native selects.
- After FormSelect rewrite, added `pickFormSelect()` — clicks trigger button, finds `role="option"`, clicks inner `<button>` (not the `<li>`). *(obvious from test helper — required because portal menu options are buttons inside li)*
- Status pick failed until clicking `optionButton` not `option` element.

**Why:** Custom dropdown DOM structure broke Testing Library's default select helpers.

**Files:** `App.integration.test.tsx` — `pickFormSelect()`, create→update test

---

## Step 6 — Integration test: status filter

**Prompt:**
> Test status filter radio calls fetchTasks with status=in_progress.

**AI response:**
Click "In progress" radio, assert last `fetchTasks` call args.

**Kept:** Verifies API param wiring, not just client-side filter.

**Files:** `App.integration.test.tsx`

---

## Step 7 — Integration test: empty and error states

**Prompt:**
> Test empty state when no tasks match filter. Test error banner when fetchTasks rejects.

**AI response:**
Mock empty array / rejected promise; assert "No tasks found" and "Could not load tasks".

**Kept:** Mandatory UI state coverage.

**Files:** `App.integration.test.tsx`

---

## Step 8 — Validation unit tests

**Prompt:**
> Add unit tests for validateTaskInput — title, owner, category, priority, status required.

**AI response:**
`validation.test.ts` with four cases.

**Kept:** Added after client-side validation utility was implemented (Step 23 implementation).

**Modified:** None.

**Files:** `src/src/test/validation.test.ts`, `src/src/utils/validateTask.ts`

---

## Step 9 — Integration test: validation blocks submit

**Prompt:**
> Test that submitting create form without title shows "Title is required." and does not call createTask API.

**AI response:**
Click Create Task with empty title, assert error message and `createTask` not called.

**Kept:** Proves frontend validation works before API round-trip.

**Files:** `App.integration.test.tsx`

---

## Step 10 — Integration test: mark in-progress quick action

**Prompt:**
> Test kanban "Start →" button on planned task calls updateTask with status in_progress.

**AI response:**
Mock planned task in list, click quick action, assert API call.

**Kept:** Covers mandatory "mark in-progress" without simulating full drag-and-drop.

**Modified:** Uses second task with `status: 'planned'` — default mock is `in_progress`. *(obvious from test data setup)*

**Why:** DnD in jsdom is unreliable; quick action exercises same code path as `handleQuickStatus`.

**Files:** `App.integration.test.tsx`

---

## Step 11 — Integration test: task detail drawer

**Prompt:**
> Test clicking task title opens detail drawer with description.

**AI response:**
Click title button, assert dialog contains description.

**Kept:** Covers mandatory "view task detail".

**Modified:**
- Use `getByRole('button', { name: 'Learn Drupal' })` not regex — avoids matching "Edit Learn Drupal".
- Use `within(drawer)` — description appears in both card and drawer. *(obvious fix from test failure)*

**Files:** `App.integration.test.tsx`

---

## What was NOT tested (and prompt that would have been declined)

**Prompt (not given / declined):**
> Add Playwright E2E against running DDEV, or PHPUnit for TaskApiController.

**Why declined:** Assessment allows mocked integration tests; time/scope. Documented in `test-strategy.md`. Backend verified manually via `curl` and `ddev drush`.

**Honest note:** Dashboard counts in integration tests assert **mocked** `fetchSummary` values, not live API aggregation. The mandatory "counts from real data" requirement is met in **production code** (`SummaryApiController`), not in the test suite itself.
