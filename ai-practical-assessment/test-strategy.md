# Test Strategy

## Test Scope

| Layer | Covered | Tool |
|-------|---------|------|
| Frontend unit | Summary + validation logic | Vitest |
| Frontend integration | Dashboard, forms, filters, states | Vitest + Testing Library |
| Backend API | Not covered (manual + DDEV verification) | — |
| E2E browser | Not covered (time constraint) | — |

## Unit Tests

**Files:** `src/src/test/summary.test.ts`, `src/src/test/validation.test.ts`

- `computeSummary()` — counts from task arrays
- `validateTaskInput()` — title, owner, category, priority, status required

## Component Tests

Not isolated per-component; covered via integration tests.

## API / Integration Tests

**File:** `src/src/test/App.integration.test.tsx`  
**Approach:** Mock `api/tasks` and `api/users` with `vi.spyOn`; render `AppRoutes` with `MemoryRouter`.

| Test | Validates |
|------|-----------|
| Dashboard loads | Summary stats and task title visible |
| Create → update flow | Form submission calls API, counts refresh |
| Status filter | Filtered tasks displayed |
| Empty state | No tasks message shown |
| Error state | API error banner shown |
| Required fields | Empty title blocks submit |
| Mark in-progress | Kanban quick action calls `updateTask` |
| Task detail | Drawer opens with description |

**Helpers:** `src/src/test/renderWithRouter.tsx`, `src/src/test/setup.ts` (jest-dom + Lottie mock)

## Edge Case Tests

- Empty task list → empty state message
- API rejection → error banner
- Summary with mixed statuses/priorities → correct counts

## Tests Not Covered (and why)

| Gap | Reason |
|-----|--------|
| Backend PHPUnit tests | Assessment is frontend-heavy; API validated manually |
| E2E (Playwright/Cypress) | Scope/time; integration tests cover main flows |
| Kanban drag-and-drop | Complex DOM simulation; manually verified |
| FormSelect portal positioning | Visual regression; manually verified in browser |
| Real API integration tests | Require running DDEV; mocked for CI speed |

## Running Tests

```bash
# From project root
npm test

# Inside DDEV
ddev exec "cd /var/www/html/src && npm test"

# Watch mode
ddev exec "cd /var/www/html/src && npm run test:watch"
```

Config: `src/vitest.config.ts` (14 tests total)
