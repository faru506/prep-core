# Operations Memory

## Local Docker workflow

**Knowledge**

The primary development stack is `docker-compose.dev.yml`, operated through the root `Makefile`:

- `make start` / `make stop` / `make restart` — staff the three containers (`rails_backend` 3000, `react_frontend` 5173, `mongodb`).
- `make logs-backend` / `make logs-frontend` — follow logs.
- `make rails`, `make bash` — Rails console / shell inside the backend container.
- `make npm-install`, `make npm-add pkg=X` — because frontend `node_modules` is an anonymous volume.
- `make lint` = frontend ESLint + backend RuboCop.
- `make reset-db` runs `docker compose down -v` and **deletes the Mongo volume** — destructive; never run against anything but disposable local data.

Both `backend/` and `frontend/` are bind-mounted, so file edits are live inside the containers.

**Use When**

Starting, restarting, or debugging the local stack.

**Source**

- `Makefile`
- `docker-compose.dev.yml`

**Last Verified**

2026-10-26

## Stale Puma PID blocks backend startup

**Knowledge**

`backend/` is bind-mounted at `/app`, so `backend/tmp/pids/server.pid` survives container recreation. After an unclean stop, the new container exits with `A server is already running (pid: 1, file: /app/tmp/pids/server.pid)` even though no server is running.

Recovery:

```bash
rm -f backend/tmp/pids/server.pid
docker compose -f docker-compose.dev.yml up -d backend
```

Then confirm `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` returns `200`. Also note the dev log can emit `log writing failed. Resource deadlock avoided @ rb_sys_fail_on_write - /app/log/development.log`; this is noise from the bind mount, not the cause of the exit.

**Use When**

The backend container starts and immediately stops, or `localhost:3000` refuses connections while `docker compose ps` shows no backend.

**Source**

- `docker-compose.dev.yml`
- `backend/tmp/pids/server.pid` behavior (observed)

**Last Verified**

2026-10-26

## Environment variables and CORS

**Knowledge**

`backend/.env` is loaded by `dotenv-rails`, which is declared **only** in the `development, test` groups — production must supply real environment variables. `.env` is gitignored. Required keys:

`RAILS_ENV`, `SECRET_KEY_BASE`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRATION_MINUTES`, `REFRESH_TOKEN_EXPIRATION_DAYS`, `ALLOWED_ORIGINS`, `FRONTEND_URL`, `JUDGE0_URL`, `JUDGE0_API_KEY`, `SENTRY_DSN`, `APP_VERSION`, `ADMIN_EMAIL`. (`REDIS_URL` is present but unused.)

CORS is configured in `backend/config/initializers/cors.rb` from the comma-separated `ALLOWED_ORIGINS` env var, defaulting to `http://localhost:5173`, with methods `GET/POST/PUT/PATCH/DELETE/OPTIONS/HEAD` and all headers exposed. Changing the frontend port requires updating `ALLOWED_ORIGINS` (and `FRONTEND_URL`).

**Use When**

Configuring a new environment, debugging CORS preflight failures, or changing ports/origins.

**Source**

- `backend/.env`
- `backend/Gemfile`
- `backend/config/initializers/cors.rb`
- `backend/.gitignore`

**Last Verified**

2026-10-26

## CI pipeline

**Knowledge**

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests, with four jobs:

1. `backend_test` — starts a `mongo:7` service and runs `bundle exec rails test`.
2. `backend_security` — `bin/brakeman --no-pager` and `bin/bundler-audit`.
3. `backend_lint` — `bin/rubocop -f github`.
4. `frontend_ci` — `npm install` then `npm run build` (Node 20).

There is no frontend lint job and no automated test job. See `testing.md` for why `backend_test` has no suite to run (the job log shows `0 runs, 0 assertions`). The frontend job uses `node-version: 20` and `npm install` even though `frontend/package-lock.json` is tracked; `npm run lint` is never run in CI. As of 2026-10-26 all four jobs pass; `backend/bin/brakeman` no longer passes `--ensure-latest`, and `bin/bundler-audit` is clean (placeholder ignore removed). The README was updated to reflect Minitest (`rails test`) and required env vars.

**Use When**

Checking what must pass before a PR, or adding a new CI step.

**Source**

- `.github/workflows/ci.yml`

**Last Verified**

2026-10-26

## Deployment configuration is scaffold only

**Knowledge**

`backend/config/deploy.yml` is the stock Kamal generated file: service/image name `backend`, placeholder server `192.168.0.1`, local registry `localhost:5555`, and `RAILS_MASTER_KEY` as the only secret. It does not describe a real target and is not used by the Docker dev workflow. There is no Procfile, no `config/deploy/` for Mina/Capistrano, and no health-check route (no `/up`) in `config/routes.rb`.

Do not treat this file as evidence of a production deployment process; verify with the user before any deploy-related work.

A production eager-load boot was verified on 2026-10-26 with `RAILS_ENV=production bundle exec rails runner "puts Rails.version"` inside the dev container (Rails 8.1.4, Puma 7.2.1). Production needs `MONGODB_URI`, `JWT_SECRET`, `SECRET_KEY_BASE`, and `ALLOWED_ORIGINS`; `.env` is not loaded in production (dotenv is development/test only), and `mongoid.yml` silently falls back to `mongodb://localhost:27017/backend_production` when `MONGODB_URI` is missing. There is no `/up` health route, `config.force_ssl` is commented out, and `config/initializers/production_safety.rb` only writes a log line (it enforces nothing). README documents only `JWT_SECRET`.

**Use When**

Asked about deployment, staging, production URLs, or health checks.

**Source**

- `backend/config/deploy.yml`
- `backend/config/routes.rb`
- `docker-compose.dev.yml`

**Last Verified**

2026-10-26

## Repository location and file visibility

**Knowledge**

- The GitHub repository lives at `faru506/prep-core`; the old `faru506/interview-prep-platform` URL redirects to it. `origin` now points directly at `git@github.com:faru506/prep-core.git`.
- This repo is configured locally (`.git/config`) to push as `faru506 <shaikfarooq2020@gmail.com>` with `core.sshCommand = ssh -i /Users/farooqshaik/.ssh/interview_prep_platform -o IdentitiesOnly=yes`. The default SSH key authenticates as `farooqshaik-ct`, which has read-only access and fails with `Permission to faru506/... denied`.
- Four commits were reattributed to `faru506 <shaikfarooq2020@gmail.com>` and force-pushed with `--force-with-lease`: `11eb3f1`/`564b037` (originally `farooqshaik-ct`) and their descendants `3e7c0ef`/`88d75f0`; after the rewrite the heads are `426e289`, `cdad56b`, `c918f79`, and `c13e4c3`. The tree content is byte-identical to the pre-rewrite head. GitHub reports all four authors as `faru506`.
- The three initial commits (`b40df63`, `497b305`, `4baabac`) still use `Farooq Shaik <farooqshaik@Farooqs-MacBook-Air.local>` and therefore show as unlinked on GitHub. Reattributing them would rewrite all 124 SHAs, so it was left undone.
- GitHub's contributor counts can lag after a force-push; the commit authors update immediately even if `contributors` still lists the old account.
- The `gh` CLI active account is still `farooqshaik-ct`. For repo operations use `GH_TOKEN=$(gh auth token --user faru506) gh ...` (or `gh auth switch --user faru506`, which changes it globally for this Mac).
- Agent and internal artifacts are intentionally kept out of the public repo and listed in `.gitignore`: `AGENTS.md`, `.agent/`, `DEEP_REVIEW_REPORT.md`, `prompt.md`, `project-related-images/`, `updated_creds.json`. They are removed from the current tree only; older commits still contain them.
- `Makefile` and `docker-compose.dev.yml` stay tracked because README setup instructions depend on them.
- The repository is **public** (`faru506/prep-core`). As of 2026-10-26, secret scanning, secret-scanning push protection, and Dependabot security updates are all **disabled** (`gh api repos/faru506/prep-core` → `security_and_analysis`). `updated_creds.json` (5 key-like entries, mode 644) still exists in the working tree and is protected only by `.gitignore`; it was never tracked. Enable push protection/secret scanning and move such files outside the repo.
- Removed internal files are still reachable in public history: `AGENTS.md` appears in 22 commits, `DEEP_REVIEW_REPORT.md` and `prompt.md` in 2 each, and `project-related-images/` in 3. `.agent/` and `opencode.jsonc` were never tracked. Current-tree removal only was an explicit decision.

**Use When**

Pushing to the remote, or asked why agent/audit files are absent from GitHub.

**Source**

- `.gitignore`
- `git remote -v`
- `git ls-tree -r --name-only origin/main`
- `~/.ssh/interview_prep_platform` (identity `faru506`)

**Last Verified**

2026-10-26
