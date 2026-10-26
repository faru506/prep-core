# Decisions Memory

## JWT via Devise + devise-jwt, stored in localStorage

**Knowledge**

- **Decision**: Authenticate with Devise and the `devise-jwt` gem using `JTIMatcher` revocation, returning the token in the `authorization` response header. The SPA keeps it in `localStorage` and sends it as a bearer token.
- **Rationale**: The app is an API-only Rails service consumed by a separate Vite dev server; cookie sessions across ports are awkward, and the existing `RackSessionFix` concern exists only to satisfy Devise internals. JWT keeps the API stateless and matches the existing `apiFetch` 401 handling.
- **Trade-off**: `localStorage` is readable by any XSS; the token carries `email` and `role` claims, so role changes only take effect after re-login (JTI revocation also invalidates sessions on logout).

**Use When**

Changing auth, token storage, logout/revocation, or role handling.

**Source**

- `backend/app/models/user.rb`
- `backend/app/controllers/concerns/rack_session_fix.rb`
- `frontend/src/utilities/storage.js`
- `frontend/src/apis/config.js`

**Last Verified**

2026-10-26

## MongoDB/Mongoid only — no ActiveRecord

**Knowledge**

- **Decision**: Persist everything in MongoDB through Mongoid; ActiveRecord is deliberately not loaded.
- **Rationale**: Content is document-shaped (embedded answers, denormalized bookmark references, flexible question payloads), and the existing models/indexes are already written for Mongoid.
- **Implication**: No migrations, no relational constraints, no `db/schema.rb`. Invariants that would normally be database constraints live in model validations and Mongo indexes.

**Use When**

Any persistence change or when tooling assumes ActiveRecord.

**Source**

- `backend/config/application.rb`
- `backend/app/models/`
- `backend/config/mongoid.yml`

**Last Verified**

2026-10-26

## Hand-written JSON payloads instead of serializers

**Knowledge**

- **Decision**: Controllers render explicit hashes; `jsonapi-serializer` remains in the Gemfile but is unused.
- **Rationale**: Small, explicit payloads keep the API shape obvious and avoid a parallel serializer layer. `User` payloads are whitelisted to prevent leaking `encrypted_password`, `jti`, or reset-token fields.
- **Trade-off**: The same shape is repeated in several controllers (users/sessions/registrations), so field changes must be applied consistently.

**Use When**

Adding fields or refactoring response code.

**Source**

- `backend/Gemfile`
- `backend/app/controllers/api/v1/**/*.rb`

**Last Verified**

2026-10-26

## CORS origins come from the environment

**Knowledge**

- **Decision**: Read allowed origins from `ALLOWED_ORIGINS` (comma-separated) with `http://localhost:5173` as the default, instead of hardcoding a single origin.
- **Rationale**: The previous hardcoded value diverged from `.env`, breaking browser requests. Env-driven config supports multiple frontends (local, LAN, deployed) without code changes.

**Use When**

Adding an origin or deploying to a new host.

**Source**

- `backend/config/initializers/cors.rb`
- `backend/.env`

**Last Verified**

2026-10-26

## Frontend state: local `useState` + `localStorage`

**Knowledge**

- **Decision**: No Redux, no global store, no data-fetching library. Pages own their state; only the JWT and derived role live in `localStorage`.
- **Rationale**: The app's state is page-scoped (course/topic/question selection, filters, pagination), and `React.memo` on list items covers the main render cost.
- **Trade-off**: Some state is re-fetched on navigation and duplicate requests are possible; introducing a global store would be a large change and is not currently justified.

**Use When**

Tempted to add state management or caching libraries.

**Source**

- `frontend/src/pages/`
- `frontend/src/utilities/storage.js`
- `frontend/src/components/QuestionCards.jsx`

**Last Verified**

2026-10-26

## Signup returns `201 Created`

**Knowledge**

- **Decision**: A successful registration responds `201 Created` instead of `200 OK`; validation failures remain `422`.
- **Rationale**: The request creates a resource, and `201` matches the REST contract already used by bookmark/upvote/admin-user creation.

**Use When**

Writing clients or tests against the registration endpoint.

**Source**

- `backend/app/controllers/api/v1/users/registrations_controller.rb#respond_with`

**Last Verified**

2026-10-26

## Dependency upgrades performed to clear advisories

**Knowledge**

- **Decision**: Clear the `bundler-audit` advisories with a targeted `bundle update --conservative` instead of ignoring them, and move the Gemfile constraint from `puma ~> 6.4` to `~> 7.2` because the Puma advisories have no 6.x fix.
- **Rationale**: The previous audit deferred upgrades to keep behavior fixes isolated. Once CI began failing, leaving known-high advisories ignored would have made the security job meaningless.
- **What changed**: Rails 8.1.3 → 8.1.4, Puma 6.6.1 → 7.2.1, json 2.19.3 → 3.1.0, jwt 3.1.2 → 3.3.0, Devise 5.0.3 → 5.0.4, Nokogiri 1.19.2 → 1.19.4, mongo 2.23.0 → 2.26.0, plus patch bumps for loofah, mail, faraday, websocket-driver, crass, erb, concurrent-ruby, msgpack, net-imap, rails-html-sanitizer, and RuboCop.
- **Verification**: `bin/bundler-audit` clean (placeholder ignore removed), Brakeman 0 warnings, RuboCop 0 offenses, Rails boots on Puma 7.2.1, signup/signin/bookmarks work, frontend build and ESLint pass, and GitHub Actions runs are green.
- **Follow-ups (2026-10-26):** `JWT_SECRET` now fails fast via `ENV.fetch`, registration update handled correctly, questions reorder uses safe lookups and validation.

**Use When**

Reviewing the lockfile, planning further upgrades, or explaining why Puma is on a major version.

**Source**

- `backend/Gemfile`
- `backend/Gemfile.lock`
- `backend/config/initializers/devise.rb`
- `backend/app/controllers/api/v1/users/registrations_controller.rb`
- `backend/app/controllers/api/v1/admin/questions_controller.rb`
- `.github/workflows/ci.yml`

**Last Verified**

2026-10-26
