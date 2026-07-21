# Reflection

## What I Built

A full-stack **AI Learning Dashboard** — a React SPA backed by Drupal 11 that tracks learning goals and project tasks. Users see summary statistics, manage tasks via kanban or grid view, create/edit tasks with owner assignment, and filter by status and keyword. Data persists in MariaDB via a custom Drupal entity. The project includes one-command DDEV setup, seed data, automated tests, and complete assessment documentation.

## How I Used AI (across the lifecycle)

| Phase | How Cursor helped |
|-------|-------------------|
| **Planning** | Drafted requirements analysis, acceptance criteria, implementation plan |
| **Design** | Proposed API contract shapes, component structure, UI flow |
| **DevOps** | Scaffolded DDEV config, setup scripts, bootstrap hooks |
| **Implementation** | Generated React components, Drupal module, CSS, animations |
| **Debugging** | Diagnosed DDEV loop, dropdown z-index, admin login issues |
| **Testing** | Wrote integration tests, fixed mocks after FormSelect change |
| **Review** | Suggested fixes; I accepted portal approach, rejected Redux/Tailwind |
| **Documentation** | Drafted all assessment artifacts; I edited for accuracy |

## What AI Helped With Most

1. **Rapid scaffolding** — DDEV config, Drupal module boilerplate, React component structure
2. **Debugging complex issues** — bootstrap loop, z-index stacking, missing admin user
3. **CSS and animations** — glassmorphism theme, premium form styling, Lottie integration
4. **Test updates** — adapting integration tests when UI components changed
5. **Documentation** — generating structured assessment artifacts from project context

## What AI Got Wrong

1. **Suggested over-engineering** — Redux, Tailwind rewrite, JSON:API migration (rejected)
2. **First dropdown fix insufficient** — z-index-only fix didn't work; portal was needed
3. **Assumed admin user exists** — README said `admin`/`admin` but database had no admin
4. **Occasionally wrong Drush syntax** — `User::loadByProperties()` doesn't exist; used `user_load_by_name()`
5. **URL confusion** — initially didn't emphasize `:5173` port requirement clearly enough

## How I Validated AI Output

- Ran `npm test` and `npm run lint` after every significant change
- Manual browser testing on DDEV URLs
- `ddev drush status` and API curl checks for backend
- Compared generated API shapes against actual `TaskSerializer` output
- Re-read AI suggestions against assessment scope before accepting
- Hard-refreshed browser to confirm CSS/HMR changes

## What I Would Improve Next

1. Add Playwright E2E tests for kanban drag-and-drop
2. Backend PHPUnit tests for validator and serializer
3. Split large CSS file into component-scoped modules
4. Export Drupal config to `config/sync/` for reproducible installs
5. Add task deletion with undo
6. Production-ready authentication layer

## Reusable Workflow (prompts, rules, specs, templates)

- **Cursor workflow:** `tool-specific/cursor-workflow/` (project-context, spec, tasks, rules)
- **Prompt history:** `ai-prompts/` grouped by activity
- **Setup template:** `scripts/setup.sh` + `ensure-drupal-admin.php` pattern
- **Assessment docs:** template structure in root markdown files
- **Key lesson:** Always set project context first, iterate on AI output, validate with tests and browser before accepting
