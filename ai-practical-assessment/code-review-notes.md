# Code Review Notes

## AI-Assisted Review Summary

Used Cursor to review local changes for:
- Dropdown portal implementation (z-index fix)
- DDEV bootstrap loop fix
- Admin user setup safeguard
- TypeScript errors in KanbanBoard, CountUp, PriorityBadge, DashboardSummary
- Integration test updates after FormSelect change

## My Review Observations

| Area | Finding | Severity |
|------|---------|----------|
| FormSelect portal | Correct approach; menu escapes modal stacking context | — |
| API client | Consistent error handling with `ApiError` class | Low risk |
| TaskValidator | Server-side validation matches frontend enums | Good |
| Anonymous API access | Acceptable for local dev; not for production | Note |
| Test mocks | Integration tests don't hit real API | Acceptable for scope |
| Setup scripts | Idempotent; safe to re-run | Good |
| CSS size | `index.css` is large but organized by section | Minor |

## Changes Made After Review

1. Portal-based `FormSelect` with backdrop and fixed positioning
2. `ensure-drupal-admin.php` + setup step for admin account
3. Fixed TS strict null checks in animation components
4. Updated integration tests with `pickFormSelect()` helper
5. Renamed `frontend/` → `src/`, moved tests to root `tests/`
6. Created all required assessment documentation artifacts

## Suggestions Rejected (and why)

| Suggestion | Reason rejected |
|------------|-----------------|
| Add Redux/Zustand for state | URL params + fetch-on-mount sufficient for scope |
| Switch to JSON:API instead of custom REST | Custom endpoints simpler and match assessment API contract |
| Add authentication to React app | Out of scope; anonymous API for local dashboard |
| Rewrite CSS with Tailwind | Would break existing glassmorphism theme and increase diff |
| Delete `motion.div` wrappers entirely | Animations are a feature requirement; portal fix was sufficient |
| Force-push amended commits | Against git safety rules; used new commits instead |
