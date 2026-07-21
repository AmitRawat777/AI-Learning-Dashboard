# Documentation Prompts

---

## Doc 1 — README and quick start

**Prompt:**
> Write README for Drupal 11 + React monorepo: clone, ddev start, one-command setup, URLs (emphasize :5173), features, test commands, troubleshooting.

**AI response (summary):**
Long README with Option A/B clone, setup table, DDEV commands, troubleshooting sections.

**Kept:** Feature list, URL table, `ddev dashboard`, test command.

**Modified:**
- Added full assessment folder structure tree after `src/` rename.
- Repeated `:5173` warning in multiple places.
- Paths updated `frontend/` → `src/`.

**Files:** `README.md`

---

## Doc 2 — Database setup notes

**Prompt:**
> Document entity schema, API endpoints, seed users, drush commands for database/ folder.

**AI response (summary):**
`setup-notes.md` with field table, endpoints, seed user passwords.

**Kept:** Core content.

**Modified:** Added references to `schema-or-migrations/project_task.sql` and `seed-data/*.json` when assessment structure was aligned.

**Files:** `database/setup-notes.md`

---

## Doc 3 — DevOps setup prompt (meta)

**Prompt:**
> (Full prompt in devops-setup.md) Scaffold complete DDEV local environment for Drupal 11 + React assessment layout.

**AI response (summary):**
229-line prompt template describing repo layout, setup.sh steps, config/sync, database folder.

**Kept:** As reference prompt for how DevOps was originally requested.

**Modified:** Actual repo uses `src/` not `src/` at assessment template path; `backend/` added for Drupal. `config/sync/` mostly empty (only `.htaccess`).

**Files:** `ai-prompts/devops-setup.md`

---

## Doc 4 — Candidate info and tool workflow

**Prompt:**
> Fill candidate-info.md: Amit Rawat, Software Engineer, Drupal+React, Cursor, Frontend-Heavy option, dates 20–23 July. Write tool-workflow.md for Cursor.

**AI response (summary):**
Template-filled candidate metadata, workflow phases table linking to ai-prompts files.

**Kept:** As assessment submission artifacts.

**Files:** `candidate-info.md`, `tool-workflow.md`

---

## Doc 5 — Cursor workflow artifacts

**Prompt:**
> Create tool-specific/cursor-workflow/: project-context.md, spec.md, tasks.md, acceptance-criteria.md, cursor-rules-or-instructions.md for Cursor-based development.

**AI response (summary):**
Persistent context (URLs, conventions), feature spec F1–F8, task traceability table, review checklist, rejected patterns list.

**Kept:** All five files with real file paths and feature IDs.

**Modified:** Tasks table includes later fixes (portal, admin, rename) as iterations. *(inferred retroactive documentation)*

**Files:** `tool-specific/cursor-workflow/*`

---

## Doc 6 — Reflection and PR description

**Prompt:**
> Write reflection.md: what I built, how I used AI, what AI got wrong, how I validated, reusable workflow. Write pr-description.md for submission.

**AI response (summary):**
Lifecycle table, acceptance/rejection rates, known limitations, test plan checklist.

**Kept:** Honest notes about rejected over-engineering, portal taking two iterations, admin user surprise.

**Modified:** Edited for accuracy against real codebase (not generic AI filler).

**Files:** `reflection.md`, `pr-description.md`, `final-ai-usage-summary.md`

---

## Doc 7 — Debugging and review documentation

**Prompt:**
> Turn our debugging sessions into debugging-notes.md and code-review-notes.md / review-fixes.md for the assessment.

**AI response (summary):**
Three debug issues documented with investigate/fix/validate structure; seven review fixes with file paths.

**Kept:** Matches actual fixes in code.

**Modified:** Written after fixes landed, not during — reconstructed chronology.

**Files:** `debugging-notes.md`, `code-review-notes.md`, `review-fixes.md`

---

## Doc 8 — API contract and data model (documentation pass)

**Prompt:**
> Generate api-contract.md and data-model.md from the implemented code (not idealized).

**AI response (summary):**
Endpoint docs with JSON examples matching `TaskSerializer`; entity table matching `ProjectTask.php`.

**Kept:** camelCase API fields, enum values, error response shape.

**Modified:** Documented computed fields and seeded-user-only API behavior explicitly.

**Files:** `api-contract.md`, `data-model.md`

---

## Doc 9 — Test results snapshot

**Prompt:**
> Document last test run: 14 tests, all pass, command to run.

**AI response (summary):**
`test-results.md` with suite table and coverage summary.

**Kept:** Updated counts as tests were added.

**Files:** `test-results.md`

---

## Doc 10 — This prompt history (meta)

**Prompt:**
> Reconstruct the most plausible step-by-step AI prompt history from the actual codebase for ai-prompts/*.md files.

**AI response (summary):**
These seven files, grouped by planning/design/implementation/testing/debugging/review/documentation, with honest (inferred) markers.

**Kept:** Only features and files that exist in the repo.

**Modified:** Replaces earlier stub prompt entries in implementation.md that had only 4 high-level prompts.

**Files:** `ai-prompts/planning.md` through `ai-prompts/documentation.md` (this set)
