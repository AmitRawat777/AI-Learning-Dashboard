# Tool Workflow

## Primary Tool: Cursor

This assessment uses **Cursor** as the primary AI development tool. All spec-driven context, rules, and iteration history live in `tool-specific/cursor-workflow/`.

## Workflow Overview

```
Requirements → Design docs → Cursor specs/rules → Implementation → Tests → Review → Reflection
```

| Phase | Artifacts | Cursor usage |
|-------|-----------|--------------|
| Planning | `requirements-analysis.md`, `acceptance-criteria.md`, `implementation-plan.md` | Brainstorm requirements, break down tasks, draft acceptance criteria |
| Design | `design-notes.md`, `api-contract.md`, `data-model.md`, `ui-flow.md` | Generate API shapes, validate against Drupal patterns |
| Implementation | `src/`, `backend/` | Iterative component/API development with context from specs |
| DevOps | `scripts/`, `.ddev/` | One-command DDEV setup scaffolding |
| Testing | `tests/`, `test-strategy.md`, `test-results.md` | Generate integration tests, fix failing assertions |
| Debugging | `debugging-notes.md` | Investigate DDEV, dropdown z-index, admin login issues |
| Review | `code-review-notes.md`, `review-fixes.md` | AI-assisted review, apply fixes selectively |
| Documentation | `README.md`, `pr-description.md`, `reflection.md` | Summarize changes, document AI usage |

## Prompt History

Grouped by activity in `ai-prompts/`:

- [planning.md](ai-prompts/planning.md)
- [design.md](ai-prompts/design.md)
- [implementation.md](ai-prompts/implementation.md)
- [testing.md](ai-prompts/testing.md)
- [debugging.md](ai-prompts/debugging.md)
- [code-review.md](ai-prompts/code-review.md)
- [documentation.md](ai-prompts/documentation.md)

## Cursor-Specific Artifacts

See [tool-specific/cursor-workflow/](tool-specific/cursor-workflow/):

- `project-context.md` — persistent project context for Cursor
- `spec.md` — feature specification
- `tasks.md` — task breakdown with traceability
- `acceptance-criteria.md` — Cursor-side acceptance checklist
- `cursor-rules-or-instructions.md` — rules and instructions used during development

## Responsible AI Usage

- Shared only non-sensitive project context (no credentials, API keys, or personal data)
- Validated all AI-generated code by running tests, lint, and manual browser checks
- Rejected suggestions that broke existing patterns or introduced unnecessary dependencies
- Iterated on AI output rather than accepting first responses blindly
