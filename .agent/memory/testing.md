# Testing Memory

## Test tooling is configured but no suite exists

**Knowledge**

`backend/Gemfile` includes `rspec-rails`, `factory_bot_rails`, `faker`, and `shoulda-matchers` in the development/test groups, and `backend/spec/` exists — but it is **empty** (no spec files, no `rails_helper.rb`, no `.rspec`). There is no `backend/test/` directory, and `config/application.rb` leaves `# require "rails/test_unit/railtie"` commented out.

`.github/workflows/ci.yml` nevertheless runs `bundle exec rails test` in the `backend_test` job, so that job does not execute a meaningful suite. Frontend has no test runner either: `frontend/package.json` defines only `dev`, `build`, `lint`, and `preview` (no Vitest/Jest/Playwright/Cypress).

Verified 2026-10-26 from GitHub Actions job `121567042732`: `rails test` reported `0 runs, 0 assertions, 0 failures, 0 errors, 0 skips` and the job passed. `bundle exec rspec` likewise prints `0 examples, 0 failures` and exits 0. A temporary `test/*_test.rb` **is** executed by `rails test` (verified: 1 run, 1 assertion), so the gap is the empty suite, not the runner. Neither CI nor RSpec fails when zero examples run, so a green CI run is not evidence of coverage. README updated 2026-10-26 to state CI runs Minitest (`rails test`) with no tests currently.

Any new regression test is therefore the first real test in the repo and must set up the RSpec bootstrap (`.rspec`, `spec/rails_helper.rb`, `spec/spec_helper.rb`) before adding specs.

**Use When**

Adding tests, interpreting CI results, or claiming "tests pass" (there is no executable backend suite today).

**Source**

- `backend/Gemfile`
- `backend/spec/` (empty)
- `backend/config/application.rb`
- `.github/workflows/ci.yml`
- `frontend/package.json`

**Last Verified**

2026-10-26

## Verified verification commands

**Knowledge**

Available checks and their last known results (2026-10-26):

- `make lint-backend` → `bundle exec rubocop` inside the container: 41 files, 0 offenses.
- `make lint-frontend` → `npm run lint` (ESLint): 0 errors.
- `npm run build` (frontend): production Vite build succeeds.
- `bin/brakeman --no-pager` → 0 warnings, exit 0.
- `bin/bundler-audit` → `No vulnerabilities found`, exit 0 (after the 2026-10-26 dependency update; see `pitfalls.md`).
- `bundle exec rails test` → exit 0 with `0 runs` (there is still no test suite).
- End-to-end API verification (signup/login/courses/topics/questions/upvote/bookmark/admin/unauth/reorder) is recorded in `DEEP_REVIEW_REPORT.md`; it is a manual curl-based run, not an automated suite.

**Use When**

Choosing which checks to run before reporting completion.

**Source**

- `Makefile`
- `.github/workflows/ci.yml`
- `DEEP_REVIEW_REPORT.md`

**Last Verified**

2026-10-26
