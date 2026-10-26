# Domain Memory

## Content hierarchy

**Knowledge**

Content is ordered `Course → Topic → Question`, with each level owning an integer `position` (1-based when reordered). A `Question` embeds exactly one `Answer` (`embeds_one :answer`, `Answer#content`), so answers are not a separate collection and are deleted with the question. `Course` and `Topic` both have a `slug` used in URLs; questions are addressed by id.

Difficulty is a shared vocabulary on `Topic#level` and `Question#level`: `low`, `medium`, `hard` (`Topic::LEVELS`, `Question::LEVELS`), default `medium`.

**Use When**

Adding content models/fields, changing ordering, or building routes that address courses/topics by slug.

**Source**

- `backend/app/models/course.rb`
- `backend/app/models/topic.rb`
- `backend/app/models/question.rb`
- `backend/app/models/answer.rb`
- `frontend/src/Router.jsx`

**Last Verified**

2026-10-26

## User engagement: bookmarks and upvotes

**Knowledge**

`Bookmark` belongs to `user`, `course`, `topic`, and `question` (the course/topic references are denormalized for fast grouping in `GET /api/v1/bookmarks`). A user can bookmark a question at most once (unique index on `user_id + question_id`); creation uses `find_or_create_by!`, so the endpoint is idempotent. Deleting a bookmark that does not exist still returns success.

`Upvote` belongs to `user` and `question`, with a unique index on `user_id + question_id`. `Question#upvote_count` is a denormalized counter updated with `inc(+1/-1)` when an upvote is created/destroyed, clamped at zero on removal. Both records cascade-delete with their `User` and `Question` (`dependent: :destroy`).

**Use When**

Changing interaction endpoints, counters, bookmark grouping, or cascade behavior.

**Source**

- `backend/app/models/bookmark.rb`
- `backend/app/models/upvote.rb`
- `backend/app/controllers/api/v1/bookmarks_controller.rb`
- `backend/app/controllers/api/v1/upvotes_controller.rb`

**Last Verified**

2026-10-26

## Roles and access rules

**Knowledge**

`User::ROLES` is `%w[user admin]`, default `user`; `User#admin?` and `User#user?` are the only role predicates. Roles are embedded in the JWT payload and read on the client for UI gating, but the server independently enforces them via `authorize_admin!`.

- Public (no token): list courses, topics, questions.
- Authenticated user: read own bookmarks, create/delete own bookmark and upvote.
- Admin: all `/api/v1/admin/*` management plus reordering.

**Use When**

Adding an endpoint or deciding which guard it needs. Never rely on the frontend guard for authorization.

**Source**

- `backend/app/models/user.rb`
- `backend/app/controllers/application_controller.rb`
- `backend/config/routes.rb`

**Last Verified**

2026-10-26
