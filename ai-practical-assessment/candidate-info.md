# Candidate Information

**Name:** Amit Rawat  
**Role:** Software Engineer  
**Primary Technology Stack:** Drupal and React

**Primary AI Tool Used:** Cursor  
**Project Option Selected:** Frontend-Heavy — AI Learning Dashboard / Project Tracker

**Assessment Start Date:** 20 July 2026  
**Submission Date:** 22 July 2026

## Project Summary

Built a full-stack **AI Learning Dashboard** that tracks learning goals, project tasks, ownership, due dates, and progress. The React SPA consumes a custom Drupal 11 REST API backed by a `project_task` content entity in MariaDB. Features include a landing page, dashboard summary cards, kanban board with drag-and-drop, grid view, search/filter, premium task forms, and Lottie animations.

## Tools Used

| Tool | Purpose |
|------|---------|
| **Cursor** | Primary AI assistant for planning, implementation, debugging, and documentation |
| **DDEV** | Local Docker environment (PHP 8.3, MariaDB 11.4, Node.js 22) |
| **Drupal 11** | Backend API, entity storage, user management |
| **React 19 + Vite 6** | Frontend SPA with TypeScript |
| **Vitest + Testing Library** | Unit and integration tests |
| **Framer Motion + Lottie** | UI animations |
| **Drush** | Drupal CLI (install, updates, admin user) |

## Setup Summary

1. Clone repository and run `ddev start` (or `./scripts/setup.sh`)
2. Setup installs Composer deps, Drupal 11, enables `ai_dashboard` module, seeds users/tasks
3. Vite dev server runs on port **5173** via DDEV daemon
4. React app: `https://ai-practical-assessment.ddev.site:5173/dashboard`
5. Drupal admin: `https://ai-practical-assessment.ddev.site/user/login` (`admin` / `admin`)
6. Run tests: `npm test` or `ddev exec "cd /var/www/html/src && npm test"`

See [README.md](README.md) for full setup and troubleshooting.
