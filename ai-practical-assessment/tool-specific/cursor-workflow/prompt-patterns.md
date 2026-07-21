# Cursor Rules & Instructions

Rules and instructions used during AI-assisted development of this project.

## Project Rules (from workspace)

1. **Follow existing patterns** — naming, folder structure, formatting, error handling
2. **Minimal changes** — smallest diff that solves the problem
3. **No new dependencies** unless necessary and justified
4. **Secure defaults** — no hardcoded credentials, no eval, no permissive CORS
5. **Tests on behavior change** — add/update tests when logic changes
6. **Explain changes** — what, why, which files

## Cursor-Specific Instructions

### Context Setting

Before implementation prompts, provide:
- Project path and tech stack (Drupal 11 + React + DDEV)
- Relevant file paths to read first
- Assessment constraints (frontend-heavy, no over-engineering)

### Iteration Pattern

1. **First prompt:** Describe feature with acceptance criteria
2. **Review output:** Run lint/tests, check browser
3. **Follow-up prompt:** Fix specific issues with evidence (screenshots, error messages)
4. **Reject bad suggestions:** State why (scope, pattern mismatch, unnecessary dep)

### Stack-Specific Guidance

**Drupal:**
- Use content entities, not nodes, for custom data
- Serializer/Validator service pattern
- Install hooks for seeding, update hooks for migrations
- Drush for admin operations

**React:**
- Functional components with hooks
- React Router for routing, URL params for filter state
- CSS custom properties (no Tailwind)
- Portal for dropdowns inside modals
- Mock Lottie in tests

**DDEV:**
- Vite daemon in `web_extra_daemons`
- Port 5173 for React, port 80/443 for Drupal
- Setup scripts must be idempotent

### What NOT to Share with AI

- API keys, tokens, passwords
- Production credentials
- Personal data beyond candidate name in docs

### Review Checklist

Before accepting AI code:
- [ ] Runs without errors (`npm test`, `npm run lint`)
- [ ] Matches existing code style
- [ ] No unnecessary dependencies added
- [ ] No secrets in code
- [ ] Browser-tested for UI changes
- [ ] Documentation updated if behavior changed

### Rejected Patterns

| Pattern | Reason |
|---------|--------|
| Redux/Zustand | URL params + fetch sufficient |
| Tailwind CSS | Existing CSS theme established |
| JSON:API | Custom REST simpler for scope |
| Radix/shadcn | Avoid new UI library deps |
| Full site reinstall | Fix in place with scripts |

## Persistent Context File

Always reference [project-context.md](project-context.md) and [spec.md](spec.md) at the start of new Cursor sessions for continuity.
