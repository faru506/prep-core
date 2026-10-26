# Database Memory

## Collections, fields, and indexes

**Knowledge**

MongoDB via Mongoid; every model declares its own indexes (no migrations).

- `courses`: `title`, `slug`, `position`; unique index on `slug`, index on `position`.
- `topics`: `title`, `slug`, `position`, `level` (default `medium`), `course_id`; indexes on `course_id`, `slug` (**not unique**), `position`, `level`.
- `questions`: `title`, `position`, `level`, `upvote_count` (default `0`), `topic_id`; indexes on `topic_id`, `position`, `level`, `upvote_count`.
- `answers`: **embedded** in questions (`content`), not a separate collection.
- `bookmarks`: `user_id`, `course_id`, `topic_id`, `question_id`; unique index on `user_id + question_id`, plus `user_id + course_id`, `user_id + topic_id`, `user_id + created_at (desc)`.
- `upvotes`: `user_id`, `question_id`; unique index on `user_id + question_id`, plus `question_id`.
- `users`: Devise fields plus `first_name`, `last_name`, `role`, `jti`, reset-password fields. No explicit Mongo index is declared in the model; email uniqueness is enforced only by Devise validation, not by a unique index.

**Use When**

Querying/updating data, adding a field/index, or investigating duplicate records.

**Source**

- `backend/app/models/course.rb`
- `backend/app/models/topic.rb`
- `backend/app/models/question.rb`
- `backend/app/models/answer.rb`
- `backend/app/models/bookmark.rb`
- `backend/app/models/upvote.rb`
- `backend/app/models/user.rb`

**Last Verified**

2026-10-26

## Connection configuration and environments

**Knowledge**

`backend/config/mongoid.yml` defines three environments and reads URIs from env vars with localhost fallbacks:

- development: `MONGODB_URI` → `mongodb://localhost:27017/prep_core_development`
- test: `MONGODB_TEST_URI` → `mongodb://localhost:27017/backend_test`
- production: `MONGODB_URI` → `mongodb://localhost:27017/backend_production`

Inside Docker, `backend/.env` sets `MONGODB_URI` to the compose service host `mongodb`, not `localhost`. `.env` is gitignored (`backend/.gitignore` ignores `/.env*`). The compose volume `mongo_data` persists the database across restarts.

**Use When**

Connecting a console/script to the right database, or debugging connection errors.

**Source**

- `backend/config/mongoid.yml`
- `backend/.env`
- `docker-compose.dev.yml`

**Last Verified**

2026-10-26

## No relational schema or migrations

**Knowledge**

ActiveRecord is disabled (`# require "active_record/railtie"` in `config/application.rb`), so there is no `db/schema.rb` and the standard `db:migrate` workflow does not apply. Schema changes are model changes only; existing documents are not backfilled automatically. When adding a field or index, consider existing documents and whether the index needs to be created explicitly (`db:mongoid:create_indexes`).

**Use When**

Changing persistence structure or being asked to "run migrations". Do not invent ActiveRecord migrations in this project.

**Source**

- `backend/config/application.rb`
- `backend/app/models/`
- `Makefile` (repository root)

**Last Verified**

2026-10-26

## Query/index gaps on hot read paths

**Knowledge**

`questions` has only single-field indexes (`topic_id`, `position`, `level`, `upvote_count`). The public/admin question list filters by `topic_id` (optionally `level`) and sorts by `position` or `upvote_count + position`, so MongoDB must filter by one index and sort in memory (or vice versa). For large topics add compound indexes such as `{ topic_id: 1, position: 1 }` and `{ topic_id: 1, level: 1, position: 1 }`. The question page also runs a separate `count` plus two `$in` lookups for bookmarks/upvotes per page (bounded by `per_page` max 50, so acceptable). `users` still has no unique index on `email`; uniqueness is only a Devise validation, so concurrent signups can create duplicates.

**Use When**

Reviewing slow list endpoints, adding filters/sorts, or discussing index changes. Index creation is a model change plus `db:mongoid:create_indexes`; there is no migration framework.

**Source**

- `backend/app/models/question.rb`
- `backend/app/models/user.rb`
- `backend/app/controllers/api/v1/admin/questions_controller.rb#index`

**Last Verified**

2026-10-26
