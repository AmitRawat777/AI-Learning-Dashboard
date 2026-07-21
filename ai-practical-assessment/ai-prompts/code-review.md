# Code Review Prompts

Review-driven changes inferred from `code-review-notes.md`, `review-fixes.md`, and code that looks refined beyond first-pass AI output.

---

## Review 1 — FormSelect portal implementation

**Prompt:**
> Review the FormSelect z-index fix. Is portal the right approach? Any accessibility gaps?

**AI response (summary):**
Portal is correct for escaping modal stacking context. Suggested keyboard navigation and aria improvements.

**Kept:** Portal pattern, backdrop, `role="listbox"` / `role="option"`, `aria-expanded`, `aria-labelledby`.

**Modified:** Did not add Radix Select dependency when suggested.

**Rejected:** Radix/shadcn — avoid new dependency per project rules.

**Files:** `FormSelect.tsx`

---

## Review 2 — Setup script idempotency and admin safeguard

**Prompt:**
> Review setup.sh for idempotency, error handling, and whether admin user is guaranteed after install.

**AI response (summary):**
Scripts are idempotent; recommend `ensure-drupal-admin` step after module enable.

**Kept:** `run_step` pattern, logging, `OPEN_BROWSER` / `FORCE_DB_IMPORT` env vars.

**Modified:** Added `step_ensure_admin_user` + PowerShell equivalent.

**Files:** `setup.sh`, `setup.ps1`, `ensure-drupal-admin.php`

---

## Review 3 — TypeScript strictness in animation components

**Prompt:**
> Fix all TypeScript lint errors from `npm run lint` in dashboard animation components.

**AI response (summary):**
Null checks, correct Framer Motion types, optional chaining on summary data.

**Kept:** All TS fixes without relaxing `tsconfig`.

**Files:** `CountUp.tsx`, `DashboardSummary.tsx`, `PriorityBadge.tsx`, `KanbanBoard.tsx`

---

## Review 4 — Integration tests after FormSelect

**Prompt:**
> App.integration.test.tsx fails — selectOptions can't find native selects. Update tests for custom dropdown.

**AI response (summary):**
Click-based helper: open trigger by label, find option, click inner button.

**Kept:** All original test scenarios; added `findByRole` wait for portal menu.

**Modified:** `pickFormSelect()` evolved through two iterations (option click → optionButton click) when status wasn't updating in create→update test.

**Files:** `App.integration.test.tsx`

---

## Review 5 — Architecture suggestions rejected

**Prompt:**
> Should we add Redux for state, React Query for caching, Tailwind for CSS, or JSON:API for Drupal?

**AI response (summary):**
Each would improve scalability for larger apps.

**Rejected (documented in code-review-notes.md):**

| Suggestion | Reason rejected |
|------------|-----------------|
| Redux/Zustand | URL params + fetch sufficient |
| React Query | fetch-on-mount adequate for scope |
| Tailwind | Large existing CSS theme |
| JSON:API | Custom REST matches contract |

**Why:** Minimal scope principle; assessment timeline; existing patterns work.

---

## Review 6 — Repository structure for submission

**Prompt:**
> Align repository to required assessment folder structure. Rename frontend→src, add all mandatory .md files, cursor-workflow artifacts, seed-data JSON.

**AI response (summary):**
File checklist, candidate-info template, prompt history stubs.

**Kept:** Full doc set at repo root; `tool-specific/cursor-workflow/` with 5 files.

**Modified:**
- `backend/` kept despite not being in template (required for full-stack).
- Tests symlink at root.
- Updated all script paths from `frontend/` to `src/`.

**Files:** 18+ root markdown files, `ai-prompts/*`, path updates across DDEV/scripts/README

---

## Review 7 — Anonymous API access security note

**Prompt:**
> Security review: anonymous users can access all task APIs.

**AI response (summary):**
Flag as acceptable for local dev only; production would need auth.

**Kept:** Open permission in `hook_install()`.

**Modified:** Documented limitation in `design-notes.md`, `pr-description.md`, `code-review-notes.md` — no code change. *(inferred — intentional dev trade-off)*

**Why:** Changing auth mid-assessment would break zero-config local demo.

---

## Review 8 — Mandatory requirements audit

**Prompt:**
> Verify every mandatory assessment requirement is implemented. Add frontend validation and tests if gaps exist.

**AI response (summary):**
All features present; gap in client-side validation before FormSelect fix; tests needed for quick action and detail drawer.

**Kept:** Existing implementation confirmed.

**Modified:**
- Added `validateTask.ts` + tests.
- Added 3 integration tests (validation block, mark in-progress, task detail).
- Expanded `acceptance-criteria.md` with requirement traceability table.

**Files:** `validateTask.ts`, `validation.test.ts`, `acceptance-criteria.md`, `App.integration.test.tsx`
