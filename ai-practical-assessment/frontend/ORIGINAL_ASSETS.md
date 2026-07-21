# Original assets

All visual assets in this frontend are **original work** created for the LearnTrack
assessment project. Nothing is copied from stock libraries, icon packs, Lottie
marketplaces, or third-party UI kits.

## Original SVG and CSS

| Area | Location | Notes |
|------|----------|--------|
| Stat dashboard icons | `src/components/StatIcon.tsx` | Inline SVG + CSS tooltips |
| UI icons (logo, kanban, filters) | `src/components/icons/UiIcons.tsx` | Inline SVG |
| Loading / empty / error states | `src/components/animations/SvgAnimations.tsx` | Inline SVG + Framer Motion |
| Hero landing scene | `src/components/animations/SvgAnimations.tsx` | `HeroSceneAnimation` |
| Kanban drag demo | `src/components/animations/KanbanDragDemo.tsx` | Inline SVG animation |
| Priority badges | `src/components/PriorityBadge.tsx` | Inline SVG |
| Floating orbs | `src/components/animations/FloatingOrbs.tsx` | CSS gradients + motion |
| Layout & glass styling | `src/index.css` | Original design tokens |

## Typography

The app uses the **system font stack** only (`system-ui`, `Segoe UI`, Roboto, etc.).
No web fonts are loaded from external CDNs.

## Removed third-party media

Previously bundled Lottie JSON files from LottieFiles were removed to avoid any
licensing ambiguity. Animations are now 100% original SVG/CSS.

## Application code

Drupal custom module (`backend/web/modules/custom/ai_dashboard/`) and React
application code are original assessment implementations.

See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) for open-source library licenses (React, Drupal, etc.).
