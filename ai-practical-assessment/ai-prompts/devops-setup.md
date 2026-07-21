# DevOps Setup Prompt — Drupal 11 + React (AI Practical Assessment)

Use this prompt to scaffold the local development environment for the assessment repository.

---

## Prompt

You are a Senior Drupal 11 DevOps Engineer and Technical Architect.

Your task is to create a complete, production-quality local development environment for a **Drupal 11 + React** project that follows the **AI Practical Assessment** repository layout.

The goal is that anyone can clone the repository and have the project running with a **single setup command**.

---

### Project structure

The repository follows an assessment-first layout. **Do not remove or relocate** existing documentation files. Add DevOps and application directories alongside them.

```
ai-practical-assessment/
├── README.md
├── candidate-info.md
├── tool-workflow.md
├── requirements-analysis.md
├── acceptance-criteria.md
├── implementation-plan.md
├── design-notes.md
├── api-contract.md
├── data-model.md
├── ui-flow.md
├── test-strategy.md
├── test-results.md
├── debugging-notes.md
├── code-review-notes.md
├── review-fixes.md
├── pr-description.md
├── reflection.md
├── final-ai-usage-summary.md
│
├── backend/                    # Drupal 11 (Composer project, docroot: backend/web)
├── src/                          # React application source (Vite + TypeScript)
├── tests/                        # Frontend / integration tests
├── scripts/                      # Setup and utility scripts
├── config/
│   └── sync/                   # Drupal configuration export (CMI)
├── database/
│   ├── dump.sql.gz             # Optional full DB import (first-run only)
│   ├── schema-or-migrations/   # SQL migrations or schema definitions
│   ├── seed-data/              # Seed SQL/JSON for local dev
│   └── setup-notes.md          # Database setup documentation
│
├── ai-prompts/
│   ├── planning.md
│   ├── design.md
│   ├── implementation.md
│   ├── testing.md
│   ├── debugging.md
│   ├── code-review.md
│   ├── documentation.md
│   └── devops-setup.md         # This prompt
│
└── tool-specific/
    ├── kiro-specs/
    ├── cursor-workflow/
    └── other-tool-workflow/
```

**Directory responsibilities:**

| Path | Purpose |
|------|---------|
| `backend/` | Drupal 11 via `drupal/recommended-project`, custom modules in `web/modules/custom/` |
| `src/` | React SPA (Vite dev server, JSON:API consumer per `api-contract.md`) |
| `tests/` | Test suites referenced in `test-strategy.md` |
| `config/sync/` | Drupal CMI — import/export via Drush |
| `database/` | Dumps, migrations, seed data — see `database/setup-notes.md` |
| `scripts/` | Cross-platform setup (`setup.sh`, `setup.ps1`) |
| `.ddev/` | DDEV project configuration (created at repo root) |

---

### Requirements

#### 1. Use DDEV as the local development environment

- DDEV config lives at the **repository root** (`.ddev/config.yaml`).
- `docroot` = `backend/web`
- `composer_root` = `backend`

#### 2. Configure

- PHP 8.3+
- MariaDB 11.4 (or MySQL 8.x)
- Composer 2
- Drush 13 (via Composer in `backend/`)
- Node.js 22
- npm

#### 3. Generate all required files

- `.ddev/config.yaml`
- `.ddev/config.local.yaml.example`
- `.ddev/docker-compose.*` **only if required** (prefer `web_extra_exposed_ports` for Vite; no extra compose file for standard local dev)
- `scripts/setup.sh`
- `scripts/setup.ps1`
- `scripts/lib/common.sh` (shared logging, state checks, error handling)
- `backend/composer.json` with `scripts` section
- `.gitignore` additions (root level)
- `database/setup-notes.md`
- Update root `README.md` with installation guide (preserve existing assessment content; add a **Local Development** section)

#### 4. Setup scripts must automatically

1. Start DDEV
2. Install Composer dependencies (`backend/`)
3. Install Drupal 11 if not already installed (`drush site:install`)
4. Import configuration from `config/sync/` if YAML files exist
5. Import `database/dump.sql.gz` if present (**first install only**, unless `FORCE_DB_IMPORT=1`)
6. Apply `database/schema-or-migrations/` in order if present
7. Load `database/seed-data/` if present and documented in `setup-notes.md`
8. Run database updates (`drush updatedb`)
9. Enable all custom modules in `backend/web/modules/custom/`
10. Clear Drupal caches
11. Install npm dependencies for React (`src/`)
12. Start the Vite dev server (HMR) via DDEV `web_extra_daemons` or equivalent
13. Display application URLs and default credentials
14. Open the browser automatically where supported (`ddev launch`, `ddev launch :5173`)

#### 5. Idempotency

- Safe to run multiple times
- Skip completed steps (installed Drupal, existing `vendor/`, enabled modules, etc.)
- Never re-import `dump.sql.gz` on subsequent runs unless `FORCE_DB_IMPORT=1`

#### 6. Script quality

- Inline comments explaining every command
- `set -euo pipefail` (bash) / `$ErrorActionPreference = "Stop"` (PowerShell)
- Error traps and non-zero exit on failure
- Success messages per step
- Timestamped logs in `scripts/logs/setup-YYYYMMDD-HHMMSS.log`

#### 7. Drupal 11 best practices

- `drupal/recommended-project:^11` with `core-recommended` metapackage
- Drush via Composer only (not global)
- Config sync at repo-root `config/sync/` (override in `settings.local.php`)
- Custom code in `web/modules/custom/` only
- Do not commit `vendor/`, `core/`, `node_modules/`, or `sites/*/files/`
- PHP 8.3+, enable `settings.local.php` include in `settings.php`

#### 8. React / Vite + DDEV integration

- Vite dev server on port **5173**
- `web_extra_exposed_ports` in `.ddev/config.yaml`
- `vite.config.ts` in `src/` (or project root if using standard Vite layout) with:
  - `host: "0.0.0.0"`
  - `strictPort: true`
  - `origin` using `process.env.DDEV_PRIMARY_URL_WITHOUT_PORT`
  - CORS for `*.ddev.site`
  - Proxy `/jsonapi` and `/api` to Drupal backend
- Environment variable: `VITE_DRUPAL_API_URL=https://ai-practical-assessment.ddev.site`

#### 9. README must include

- Prerequisites (Docker, DDEV v1.24+, Git, 8 GB RAM)
- Clone instructions
- One-command setup (`./scripts/setup.sh` / `.\scripts\setup.ps1`)
- Useful DDEV commands
- Troubleshooting (flood/login, Vite Bad Gateway, port conflicts, `ddev poweroff`)
- Project URLs
- Default admin credentials (`admin` / `admin`, overridable via env vars)
- Pointer to `database/setup-notes.md` and `api-contract.md`

#### 10. Assessment alignment

- Cross-reference `requirements-analysis.md`, `acceptance-criteria.md`, and `implementation-plan.md` where relevant
- Do not overwrite candidate documentation files
- Add DevOps notes to `tool-workflow.md` only if asked; otherwise keep changes scoped to README and `database/setup-notes.md`

---

### Default URLs and credentials

| Item | Value |
|------|-------|
| Project name | `ai-practical-assessment` |
| Drupal | `https://ai-practical-assessment.ddev.site` |
| React (Vite) | `https://ai-practical-assessment.ddev.site:5173` |
| Admin user | `admin` |
| Admin pass | `admin` |

---

### Output format

**Generate each file separately with its filename as a heading.**

Example:

```
## .ddev/config.yaml

<file contents>

## scripts/setup.sh

<file contents>
```

Do not combine multiple files under one heading. Include full file contents, not summaries.

---

### Validation checklist

Before finishing, confirm:

- [ ] Fresh clone + `./scripts/setup.sh` completes without errors
- [ ] Second run is idempotent (no reinstall, no DB re-import)
- [ ] Drupal admin login works (`admin` / `admin`)
- [ ] `https://ai-practical-assessment.ddev.site` returns HTTP 200
- [ ] `https://ai-practical-assessment.ddev.site:5173` returns HTTP 200 (Vite HMR)
- [ ] Custom modules in `backend/web/modules/custom/` are auto-enabled
- [ ] `config/sync/*.yml` imports when present
- [ ] `database/dump.sql.gz` imports only on first install
