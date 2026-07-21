# Third-party notices

This project uses open-source software under permissive licenses. **Application UI
assets (icons, illustrations, animations) are original** — see
[frontend/ORIGINAL_ASSETS.md](frontend/ORIGINAL_ASSETS.md).

## Project license

- **Drupal custom module & PHP code:** GPL-2.0-or-later (see `backend/composer.json`)
- **Frontend application code:** Same repository; assessment submission

## Frontend npm dependencies (summary)

| Package | License | Use |
|---------|---------|-----|
| react, react-dom | MIT | UI framework |
| react-router-dom | MIT | Routing |
| framer-motion | MIT | Animations |
| vite | MIT | Build tool |
| typescript | Apache-2.0 | Type checking |
| vitest, @testing-library/* | MIT | Tests |

Full license texts are in `frontend/node_modules/<package>/LICENSE` after `npm install`.

## Backend PHP dependencies

Drupal core, Symfony components, and Composer packages are GPL-2.0-or-later or
compatible OSI licenses. See `backend/vendor/` after `composer install`.

## What we do **not** include

- No stock photos or videos
- No LottieFiles / marketplace animations
- No copied Uiverse or Locofy component source code
- No external icon font packs (Font Awesome, etc.)
- No Google Fonts or other CDN-hosted fonts

## Attribution

If you redistribute this project, retain this file and respect the licenses of
bundled dependencies. Original LearnTrack UI assets require no separate attribution.
