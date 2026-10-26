# Pitfalls Memory

## Controller actions below `private` are not routable

**Knowledge**

`Api::V1::Admin::QuestionsController#reorder` was once defined after the `private` keyword. Rails still lists the route, but the action is not callable, so reordering failed. The fix was to move `reorder` above `private`. When a route exists but its action appears missing or returns an unexpected auth/404 result, check method visibility first.

**Use When**

Adding an action to an existing controller, especially near a `private` section.

**Source**

- `backend/app/controllers/api/v1/admin/questions_controller.rb`
- `backend/config/routes.rb`

**Last Verified**

2026-10-26

## `getRole()` does not validate token expiry

**Knowledge**

`getRole()` decodes the JWT payload directly from `localStorage`; it returns the `role` claim even when the token is expired. `getToken()` is the function that checks `exp` and clears storage. A guard that only calls `getRole()` (as `AdminRoute` originally did) lets an expired admin token through the UI guard.

Rule: any guard or authenticated page must call `getToken()` first, then read the role. Server-side authorization remains the real control.

**Use When**

Editing `ProtectedRoute`, `AdminRoute`, navbar role state, or any client-side permission check.

**Source**

- `frontend/src/utilities/storage.js`
- `frontend/src/routes/AdminRoute.jsx`
- `frontend/src/routes/ProtectedRoute.jsx`

**Last Verified**

2026-10-26

## Frontend/backend port and CORS mismatch

**Knowledge**

Vite serves on `5173`, but `backend/.env` previously set `ALLOWED_ORIGINS`/`FRONTEND_URL` to `3001` while `cors.rb` hardcoded `http://localhost:5173`. The result is inconsistent configuration and browser CORS failures whenever the env var is the source of truth. Both `.env` values are now `http://localhost:5173`, and CORS reads `ALLOWED_ORIGINS` (comma-separated, default `5173`).

**Use When**

Changing dev ports, adding another origin (e.g. a LAN address), or debugging "blocked by CORS policy".

**Source**

- `backend/config/initializers/cors.rb`
- `backend/.env`
- `docker-compose.dev.yml`
- `frontend/src/apis/config.js`

**Last Verified**

2026-10-26

## CI test job has no suite to run

**Knowledge**

`.github/workflows/ci.yml` runs `bundle exec rails test`, but `backend/spec/` is empty, there is no `backend/test/`, and the test-unit railtie is not required. Do not interpret a green CI run as evidence of test coverage; conversely, do not assume the job actually behaves as intended.

**Use When**

Reporting verification status or modifying CI.

**Source**

- `.github/workflows/ci.yml`
- `backend/config/application.rb`
- `backend/spec/`

**Last Verified**

2026-10-26

## Topic slugs are not unique

**Knowledge**

`Course#slug` has `uniqueness: true` plus a unique index. `Topic#slug` only has a presence validation and a non-unique index, so two topics can share a slug (including within the same course). Public routes address topics by slug (`/interview_qa/:courseSlug/:topicSlug?`), while the API resolves topics by id, so duplicate slugs mostly affect client-side navigation/deep links.

**Use When**

Working on topic creation/updating, slug generation, or deep-link resolution.

**Source**

- `backend/app/models/course.rb`
- `backend/app/models/topic.rb`
- `frontend/src/Router.jsx`
- `frontend/src/pages/InterviewQA.jsx`

**Last Verified**

2026-10-26

## Public endpoints are implemented in admin controllers

**Knowledge**

`/api/v1/courses`, `/api/v1/courses/:course_id/topics`, and `/api/v1/topics/:topic_id/questions` are routed to `Api::V1::Admin::*Controller#index`, which `skip_before_action` both authentication and admin authorization. Editing those skip lines, or adding a new public action to those controllers, can accidentally expose admin behavior or break public browsing.

**Use When**

Touching admin controllers or adding read endpoints.

**Source**

- `backend/config/routes.rb`
- `backend/app/controllers/api/v1/admin/courses_controller.rb`
- `backend/app/controllers/api/v1/admin/topics_controller.rb`
- `backend/app/controllers/api/v1/admin/questions_controller.rb`

**Last Verified**

2026-10-26

## `make migrate` does not apply here

**Knowledge**

The Makefile exposes `make migrate` → `rails db:migrate`, but ActiveRecord is disabled in `config/application.rb`, so there is no schema or migration task for this app. Schema evolution happens in Mongoid model files; indexes are created by Mongoid tooling. Treating this as a normal Rails/ActiveRecord project leads to nonexistent migration files and confusion.

**Use When**

A task mentions migrations, schema, or database setup.

**Source**

- `Makefile`
- `backend/config/application.rb`
- `backend/app/models/`
- `backend/config/mongoid.yml`

**Last Verified**

2026-10-26

## Login response header already includes `Bearer`

**Knowledge**

`POST /api/v1/users/sign_in` returns `authorization: Bearer <jwt>` as a response header. Scripts and tests that read that header and prepend `Bearer ` again produce `Authorization: Bearer Bearer ...`, which Devise rejects with `401` (often "Not enough or too many segments"). Use the header value as-is, or strip the prefix before storing/rebuilding it.

**Use When**

Writing curl scripts, E2E checks, or any client that consumes the login header.

**Source**

- `backend/app/controllers/api/v1/users/sessions_controller.rb`
- `frontend/src/utilities/storage.js`

**Last Verified**

2026-10-26

## Unbounded and non-atomic operations

**Knowledge**

Known scaling/concurrency limitations in the current code (not yet fixed):

- `GET /api/v1/admin/users` loads every user with no pagination.
- Bookmark/upvote create first queries for an existing record and then inserts; the unique indexes prevent duplicates at the database level, but two concurrent requests can still race and one may surface a duplicate-key error instead of a clean success.
- Position cleanup on delete updates siblings one document at a time (`inc(-1)` per record) rather than in a single bulk update.

**Use When**

Investigating slow admin pages, rare 500s on rapid repeated clicks, or ordering drift after deletes.

**Source**

- `backend/app/controllers/api/v1/admin/users_controller.rb#index`
- `backend/app/controllers/api/v1/upvotes_controller.rb#create`
- `backend/app/controllers/api/v1/bookmarks_controller.rb#create`
- `backend/app/controllers/api/v1/admin/{courses,topics,questions}_controller.rb#destroy`

**Last Verified**

2026-10-26

## Brakeman `--ensure-latest` fails CI when a newer version exists

**Knowledge**

The Rails-generated `backend/bin/brakeman` called `ARGV.unshift("--ensure-latest")`. When a newer Brakeman release exists, it prints `Brakeman X is not the latest version Y` and exits `5` even with zero security warnings. That made the `Rails Backend Security Scan` job fail while the scan itself was clean. The flag was removed so gem freshness is no longer a hard CI gate; the scan result is.

**Use When**

Debugging a red security job that shows no Brakeman warnings, or regenerating `bin/brakeman`.

**Source**

- `backend/bin/brakeman`
- `.github/workflows/ci.yml`

**Last Verified**

2026-10-26

## Dependency advisories were cleared on 2026-10-26

**Knowledge**

`bin/bundler-audit` originally reported advisories across Rails/ActiveStorage, Puma, Nokogiri, Devise, jwt, mongo, loofah, concurrent-ruby, and others. They were cleared with a targeted `bundle update --conservative` and by moving the Gemfile constraint to `puma ~> 7.2`. Current result: `No vulnerabilities found`. Notable versions: Rails 8.1.4, Puma 7.2.1, json 3.1.0, jwt 3.3.0. The placeholder `CVE-THAT-DOES-NOT-APPLY` was removed from `backend/config/bundler-audit.yml` (now `ignore: []`).

Advisories will reappear as the lockfile ages, so re-run `bin/bundler-audit` periodically rather than assuming the tree stays clean.

**Use When**

Answering security questions, updating the backend lockfile, or diagnosing the security CI job.

**Source**

- `backend/Gemfile`
- `backend/Gemfile.lock`
- `backend/config/bundler-audit.yml`
- `bin/bundler-audit`
- GitHub Actions run `40320156974` (all four jobs green)

**Last Verified**

2026-10-26

## Mongoid `find_by(id:)` raises when the record is missing

**Knowledge**

Mongoid 9's `find_by` is not ActiveRecord's: it calls `where(attrs).find_first` and raises `Mongoid::Errors::DocumentNotFound` when the result is nil and `Mongoid.raise_not_found_error` is true (default here). Verified in the running app: `Topic.find_by(id: "000000000000000000000000")`, `find_by(id: "abc")`, and `find_by(id: nil)` all raise; `Topic.where(id: ...).first` returns `nil`. Rails maps `Mongoid::Errors::DocumentNotFound` to `:not_found` via `config.action_dispatch.rescue_responses`, so production still returns 404, but the controller's `return render ... :not_found unless record` branch is unreachable and the response is the generic 404, not the intended JSON body.

**Use When**

Writing `find_by(id:)` guards or replacing `find` with `find_by` to avoid exceptions. Use `where(id: ...).first` for a nil-returning lookup, add a `rescue_from Mongoid::Errors::DocumentNotFound` that renders the API error shape, or consciously set `Mongoid.raise_not_found_error = false`.

**Source**

- `backend/app/controllers/api/v1/admin/questions_controller.rb#reorder`
- `backend/app/controllers/api/v1/admin/users_controller.rb`
- Mongoid `lib/mongoid/findable.rb#find_by` (v9.0.10)
- `Rails.application.config.action_dispatch.rescue_responses`

**Last Verified**

2026-10-26

## `registrations#respond_with` returns 422 for a successful account update

**Knowledge**

Previously, `Api::V1::Users::RegistrationsController#respond_with` handled only `POST` (sign up) and `DELETE`; a successful `PUT/PATCH /api/v1/users` (Devise account update) fell into the `else` branch and returned `422` with "User couldn't be created successfully." This was fixed on 2026-10-26: `respond_with` now handles `PUT/PATCH` and returns `200 OK` with user payload on success or `422` with errors on failure. The typo "sucessfully" was corrected to "successfully". The current frontend has no profile-update UI, so it was latent.

**Use When**

Adding profile/settings updates or testing the Devise registration endpoints.

**Source**

- `backend/app/controllers/api/v1/users/registrations_controller.rb#respond_with` (updated 2026-10-26)
- Devise `app/controllers/devise/registrations_controller.rb#update`

**Last Verified**

2026-10-26

## Admin reorder is not fully validated or atomic

**Knowledge**

`POST /api/v1/admin/{courses,topics,questions}/reorder` iterates `params[..._ids].each_with_index` and writes positions one document at a time. Missing/blank params can raise errors; ids outside scope can raise exceptions mid-loop leaving partial reorders (MongoDB standalone has no multi-document transaction). `update`/`update!` behavior varies. Questions reorder now uses safe lookup (`Topic.where(id: ...).first`), validates `question_ids` is a non-empty array, and skips missing questions within scope. Courses/topics reorder still lack validation and parent scoping in places.

**Use When**

Touching reorder endpoints or debugging duplicate/gapped positions. Validate the array, pre-check membership with one query, then write with `bulk_write`/`update_all` after validation.

**Source**

- `backend/app/controllers/api/v1/admin/questions_controller.rb#reorder` (updated 2026-10-26)
- `backend/app/controllers/api/v1/admin/courses_controller.rb#reorder`
- `backend/app/controllers/api/v1/admin/topics_controller.rb#reorder`

**Last Verified**

2026-10-26
