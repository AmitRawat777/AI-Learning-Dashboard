# AI Practical Assessment

Drupal 11 + React monorepo with a one-command [DDEV](https://ddev.com/) local development environment.

## Quick start (one command)

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) must be installed and running. DDEV is installed automatically by the setup script if missing.

### After git clone — run ONE command:

```bash
git clone <repository-url> ai-practical-assessment
cd ai-practical-assessment
./install.sh
```

That's it. The script will:

1. Verify Docker is running
2. **Install DDEV** if not present (`curl -fsSL https://ddev.com/install.sh | bash`)
3. Start DDEV containers
4. Run `composer install` → `vendor/` + `web/core/`
5. Install Drupal (first run only) + enable `ai_dashboard`
6. Seed demo users and tasks
7. Run `npm ci` in `src/`
8. Start Vite on port **5173**
9. Open the dashboard in your browser

Equivalent commands: `./setup.sh` or `make`

To skip automatic DDEV install: `AUTO_INSTALL_DDEV=0 ./install.sh`

### Option A — Clone with git hooks (also automatic)

```bash
git clone -c core.hooksPath=.githooks <repository-url> ai-practical-assessment
cd ai-practical-assessment
```

Setup runs automatically via the `post-checkout` hook if Docker is already running.

### Option B — `ddev start` only (if already set up once)

```bash
git clone <repository-url> ai-practical-assessment
cd ai-practical-assessment
ddev start
```

On first `ddev start`, post-start hooks run `composer install` and bootstrap Drupal/npm.

**If you see a missing `vendor/autoload_runtime.php` error**, run `./install.sh` instead.

### Clone to any folder

You **can** clone this repo to any directory (`~/Projects`, `~/Pictures`, `~/Desktop`, etc.). DDEV does not require a fixed path.

DDEV registers the project **name** (`ai-practical-assessment` from `.ddev/config.yaml`) on **your machine** the first time you run `ddev start`. If you later move or copy the folder to a new path, run:

```bash
ddev stop --unlist ai-practical-assessment
cd /your/new/path/ai-practical-assessment
ddev start
```

On a **new computer**, clone anywhere and run `ddev start` — no unlist needed.

### What gets installed automatically

- PHP / Composer packages (`vendor/`)
- Drupal 11 + custom `ai_dashboard` module + seed data
- Node.js / npm packages (`src/node_modules/`)
- Vite dev server (hot reload on port 5173)

After `git pull`, `post-merge` syncs Composer and npm dependencies when DDEV is running.

### Manual setup (optional)

If you prefer to run setup yourself:

| Command | Platform |
|---------|----------|
| `./setup.sh` | Linux / macOS |
| `make` or `make setup` | Linux / macOS |
| `ddev setup` | Any (with DDEV running) |
| `npm run setup` | Any |
| `.\scripts\setup.ps1` | Windows PowerShell |
| `setup.bat` | Windows CMD |

## AI Learning Dashboard

Full-stack project tracker for learning goals, tasks, ownership, due dates, and progress.

| Page | URL |
|------|-----|
| Landing | https://ai-practical-assessment.ddev.site:5173/ |
| Dashboard | https://ai-practical-assessment.ddev.site:5173/dashboard |
| All tasks | https://ai-practical-assessment.ddev.site:5173/tasks |
| New task | https://ai-practical-assessment.ddev.site:5173/tasks/new |
| Task detail | https://ai-practical-assessment.ddev.site:5173/tasks/{id} |
| Edit task | https://ai-practical-assessment.ddev.site:5173/tasks/{id}/edit |

Filter via query params: `/dashboard?status=in_progress&search=drupal&view=grid`

### Features

- Dashboard summary cards (total, completed, in progress, overdue, high priority)
- Create, list, view, and update project tasks
- Keyword search and status filter
- Mark tasks in-progress or completed
- Loading, empty, success, and error UI states
- Data persisted in Drupal (survives restart)

### Run tests

```bash
ddev exec "cd /var/www/html/src && npm test"
```

### API

See [database/setup-notes.md](database/setup-notes.md) for endpoints and entity schema.

## Project structure

```
ai-practical-assessment/
├── README.md
├── composer.json          # Drupal 11 Composer project (committed)
├── composer.lock          # Locked PHP dependencies (committed)
├── vendor/                # PHP packages (gitignored — created by composer install)
├── web/                   # Drupal docroot (gitignored: core/, contrib/)
├── candidate-info.md
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
├── src/                   React + Vite application
├── tests/                 Vitest unit and integration tests
├── scripts/               Setup scripts (bash + PowerShell)
├── config/sync/           Drupal configuration export
├── database/              Schema notes, seed data, optional dump
├── ai-prompts/            AI prompt history by activity
├── tool-specific/         Cursor workflow artifacts
└── .ddev/                 DDEV configuration
```

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [Docker](https://docs.docker.com/get-docker/) | Latest stable | Docker Desktop or Docker Engine + Compose |
| [DDEV](https://ddev.com/get-started/) | v1.24+ | `curl -fsSL https://ddev.com/install.sh \| bash` |
| [Git](https://git-scm.com/) | Any recent | To clone the repository |
| RAM | 8 GB+ recommended | Docker containers need memory headroom |

Verify installations:

```bash
docker --version
ddev version
```

## Clone the repository

```bash
git clone -c core.hooksPath=.githooks <repository-url> ai-practical-assessment
cd ai-practical-assessment
```

Setup runs automatically. If you used a plain `git clone` without hooks, run `ddev start` once instead.

## One-command setup

Run from the **project root**. Installs Composer, Drupal, npm (including Lottie animations), and starts Vite. Idempotent — safe after every `git pull`.

### Linux / macOS

```bash
./setup.sh
# or
make setup
# or
ddev setup
```

### Windows (PowerShell)

```powershell
.\scripts\setup.ps1
```

### Windows (CMD)

```cmd
setup.bat
```

### What the setup script does

1. Starts DDEV containers (PHP 8.3, MariaDB 11.4, Node.js 22)
2. Installs Composer dependencies (`composer install` → `vendor/` + `web/core/`)
3. Installs Drupal 11 if not already installed
4. Imports `database/dump.sql.gz` on first install (if present)
5. Enables custom modules in `web/modules/custom/`
6. Runs database updates (`drush updatedb`) — seeds sample tasks
7. Imports configuration from `config/sync/` (if YAML files exist)
8. Clears Drupal caches
9. Installs **all** npm dependencies in `src/` from `package-lock.json` (`npm ci`)
10. Restarts DDEV to start the Vite dev server
11. Verifies Vite and the Drupal API are responding
12. Displays application URLs and opens the browser

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DRUPAL_ADMIN_USER` | `admin` | Drupal admin username |
| `DRUPAL_ADMIN_PASS` | `admin` | Drupal admin password |
| `DRUPAL_SITE_NAME` | `AI Practical Assessment` | Site name |
| `FORCE_DB_IMPORT` | `0` | Set to `1` to re-import `database/dump.sql.gz` |
| `OPEN_BROWSER` | `1` | Set to `0` to skip auto-opening the browser |

Example:

```bash
DRUPAL_ADMIN_PASS=secret ./scripts/setup.sh
```

## Project URLs

After setup completes:

| Service | URL |
|---------|-----|
| Drupal backend | https://ai-practical-assessment.ddev.site |
| React frontend (Vite HMR) | https://ai-practical-assessment.ddev.site:5173 |
| Drupal admin | https://ai-practical-assessment.ddev.site/admin |
| JSON:API | https://ai-practical-assessment.ddev.site/jsonapi |
| Mailpit (email testing) | https://ai-practical-assessment.ddev.site:8025 |

## Default admin credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin` |

Change these via environment variables before running setup, or update the password in Drupal after install.

## Useful DDEV commands

```bash
# Start / stop the environment
ddev start
ddev stop
ddev restart

# Project info and URLs
ddev describe

# Shell into the web container
ddev ssh

# Drupal CLI
ddev drush status
ddev drush cache:rebuild
ddev drush config:export
ddev drush config:import
ddev drush uli                    # One-time login link

# Composer (project root — same as standard Drupal)
ddev composer require drupal/devel
ddev composer update

# Node.js / npm (runs in src/)
ddev exec "cd /var/www/html/src && npm run build"

# View logs
ddev logs

# Open site in browser
ddev launch
ddev launch :5173                 # Vite dev server
```

## Composer scripts

Run these from inside DDEV (project root):

```bash
ddev composer drupal:install        # Install Drupal (standard profile)
ddev composer drupal:update         # Run updatedb + cache rebuild
ddev composer drupal:config-import  # Import config/sync
ddev composer drupal:enable-custom  # Enable all custom modules
ddev composer drupal:cache-clear    # Rebuild caches
```

## Configuration management

Drupal configuration is stored at the repository root in `config/sync/`.

```bash
# Export current config
ddev drush config:export -y

# Import config (also done by setup script)
ddev drush config:import -y
```

## Database import / export

Place a gzipped SQL dump at `database/dump.sql.gz`. The setup script imports it automatically on **first install only**.

To force a re-import:

```bash
FORCE_DB_IMPORT=1 ./scripts/setup.sh
```

Export the current database:

```bash
ddev export-db --file=database/dump.sql.gz
```

## Custom modules

Place custom modules in `web/modules/custom/`. The setup script auto-enables any module directory found there.

Current custom modules:

- `ai_dashboard` — Backend support for the React learning dashboard

## Frontend development

The React app uses Vite with Hot Module Replacement (HMR). The Vite dev server starts automatically via DDEV `web_extra_daemons`.

```bash
# Manual build (production assets)
ddev exec "cd /var/www/html/src && npm run build"

# Output goes to src/dist/
```

Copy environment variables:

```bash
cp src/.env.example src/.env
```

## Troubleshooting

### DDEV won't start — "project root is already set to..."

DDEV allows only **one folder per project name** on the same machine. This happens when you:

- Copied the project to another directory (e.g. `Documents/` → `Pictures/`)
- Cloned the repo twice in different locations

**Fix:**

```bash
ddev stop --unlist ai-practical-assessment
cd "/path/to/your/current/ai-practical-assessment"
ddev start
```

This does **not** delete your database — it only clears DDEV's path registration so it can bind to the new folder.

### DDEV won't start

```bash
ddev poweroff          # Stop all DDEV projects
ddev start             # Retry
ddev debug compose     # Inspect Docker Compose config
```

### Port conflicts

Another service may be using ports 80, 443, or 5173. Stop conflicting services or run `ddev poweroff` and retry.

### Vite shows "Blocked request. This host is not allowed"

Vite 6 blocks unknown `Host` headers. The app must be opened via the DDEV URL (not `localhost:5173` on another machine):

- **Use:** `https://ai-practical-assessment.ddev.site:5173/dashboard`
- **Not:** `http://localhost:5173` when browsing through the DDEV router

`src/vite.config.ts` includes `server.allowedHosts` for `*.ddev.site`. After pulling the fix, run `ddev restart`.

### Vite shows "Bad Gateway" or CORS errors

1. Confirm Vite is running: `ddev logs | grep vite`
2. Restart DDEV: `ddev restart`
3. Visit Vite directly: `ddev launch :5173`
4. Check `src/vite.config.ts` has `host: "0.0.0.0"` and `strictPort: true`

### Composer install fails (memory)

```bash
ddev config --php-memory-limit=4G
ddev restart
./scripts/setup.sh
```

### Drupal shows "No route" or bootstrap errors

```bash
ddev drush status
ddev drush updatedb -y
ddev drush cache:rebuild
```

### Mutagen sync issues (macOS)

If file changes are slow or missing:

```bash
ddev mutagen reset
# Or disable Mutagen for this project:
# Add to .ddev/config.local.yaml: performance_mode: "none"
```

### Re-run setup from scratch

```bash
ddev delete -O           # Remove containers but keep files
rm -rf vendor web/core
./scripts/setup.sh       # Full reinstall
```

### Setup logs

Each run creates a timestamped log at `scripts/logs/setup-YYYYMMDD-HHMMSS.log`.

## License

GPL-2.0-or-later (Drupal components). See individual package licenses for frontend dependencies.
