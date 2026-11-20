# Testing Memory

## Backend RSpec request suite

**Knowledge**

Backend tests are RSpec request specs (`backend/spec/requests/`) covering auth (sign-up/sign-in, role self-promotion), admin access (401/403/payload shape), public question listing (pagination, level filter, upvote sort, per-user flags), bookmarks, and upvotes (idempotency, counter clamping). Run with `make test-backend`, which sets `RAILS_ENV=test` and `MONGODB_TEST_URI=mongodb://mongodb:27017/prep_core_test` (the default `localhost` test URI does not resolve inside the container). CI runs `bundle exec rspec` against its own `mongo:7` service.

- `spec/rails_helper.rb` forces `RAILS_ENV=test`, defaults `JWT_SECRET`, calls `Mongoid.purge!` before every example, and **aborts unless the database name ends in `_test`** (`.env` sets a dev `MONGODB_URI`; the guard stops specs wiping dev data).
- Factories live in one file, `spec/factories.rb` (`user` with `:admin` trait, `course`, `topic`, `question` with embedded `Answer`, `bookmark`, `upvote`).
- Auth in request specs: `auth_headers_for(user)` from `spec/support/request_helpers.rb` (wraps `Devise::JWT::TestHelpers.auth_headers`); `json` parses the response.
- Sign-up is `POST /api/v1/users` (Devise registration), not `/sign_up` (that path is the GET `new` action).
- Use `:unprocessable_content`, not `:unprocessable_entity`, in `have_http_status` (Rack deprecation).
- Frontend still has no test runner.

**Use When**

Adding or running tests, or interpreting CI results.

**Source**

- `backend/spec/rails_helper.rb`
- `backend/spec/factories.rb`
- `backend/spec/support/request_helpers.rb`
- `Makefile` (`test-backend`)
- `.github/workflows/ci.yml`

**Last Verified**

2026-11-20

## Verified verification commands

**Knowledge**

Available checks and their last known results (2026-10-26):

- `make lint-backend` → `bundle exec rubocop` inside the container: 41 files, 0 offenses.
- `make lint-frontend` → `npm run lint` (ESLint): 0 errors.
- `npm run build` (frontend): production Vite build succeeds.
- `bin/brakeman --no-pager` → 0 warnings, exit 0.
- `bin/bundler-audit` → `No vulnerabilities found`, exit 0 (after the 2026-10-26 dependency update; see `pitfalls.md`).
- `make test-backend` → 24 examples, 0 failures (2026-11-20).
- End-to-end API verification (signup/login/courses/topics/questions/upvote/bookmark/admin/unauth/reorder) is recorded in `DEEP_REVIEW_REPORT.md`; it is a manual curl-based run, not an automated suite.

**Use When**

Choosing which checks to run before reporting completion.

**Source**

- `Makefile`
- `.github/workflows/ci.yml`
- `DEEP_REVIEW_REPORT.md`

**Last Verified**

2026-10-26
