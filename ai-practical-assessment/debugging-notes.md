# Debugging Notes

## Issue 1: Project Not Loading (404 / Blank Screen)

### Problem

Visiting the app returned 404 or blank page. Vite URL without port showed Drupal default page.

### How I Investigated

1. Checked DDEV status — containers were stopped
2. Verified URL: React app requires `:5173` port (`https://ai-practical-assessment.ddev.site:5173`)
3. Checked `ddev logs` for Vite daemon errors
4. Found bootstrap loop in `scripts/setup.sh` post-start hook

### How AI Helped

Cursor identified that `is_ddev_running()` returned false during post-start hook, causing infinite `ddev start` loop. Suggested `RUN_SETUP_NO_RESTART=1` flag and fixed status detection.

### What I Validated

- `ddev start` completes without loop
- `ddev dashboard` opens correct URL
- Vite responds on port 5173
- API `/api/tasks/summary` returns 200

### Final Fix

- Fixed `scripts/lib/common.sh` `is_ddev_running()` to detect `OK` status
- Added `RUN_SETUP_NO_RESTART` in bootstrap hook
- Added `ddev dashboard` host command
- Documented correct URLs in README

---

## Issue 2: Dropdown Menu Hidden Behind Form Fields

### Problem

In the Create/Update Task modal, opening Priority or Owner dropdown showed options behind fields below (z-index stacking issue).

### How I Investigated

1. Inspected CSS stacking contexts in `src/src/index.css`
2. Noted `motion.div` wrappers and modal `overflow` creating new contexts
3. Confirmed semi-transparent dropdown background made overlap worse

### How AI Helped

Cursor suggested portal-based rendering: mount dropdown menu to `document.body` with fixed positioning and high z-index (10100), plus a dimmed backdrop.

### What I Validated

- Opened Priority dropdown — menu floats above all fields
- Menu position updates on scroll/resize
- Integration tests still pass with `pickFormSelect()` helper
- Hard refresh confirms HMR picked up changes

### Final Fix

- Rewrote `FormSelect.tsx` to use `createPortal()` for menu
- Added `.form-select__menu--portal` and `.form-select__backdrop` CSS
- Updated `App.integration.test.tsx` with `pickFormSelect()` helper

---

## Issue 3: Cannot Login to Drupal Admin

### Problem

Visiting `/admin` showed "Access denied". No `admin` user existed; `administrator` role was missing.

### How I Investigated

1. Ran `ddev drush user:information admin` — user not found
2. Queried `users_field_data` — uid 1 was `placeholder-for-uid-1`
3. Ran `ddev drush role:list` — no `administrator` role

### How AI Helped

Cursor created `scripts/ensure-drupal-admin.php` to create administrator role and admin user, added setup step, and `ai_dashboard_update_9003` hook.

### What I Validated

- `ddev drush user:information admin` shows administrator role
- Login at `/user/login` with `admin`/`admin` works
- `/admin` accessible after login
- `ddev drush uli --name=admin` generates working one-time link

### Final Fix

- Created admin user with administrator role
- Added permanent safeguard in setup scripts and update hook
