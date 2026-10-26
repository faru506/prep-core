# APIs Memory

## Authentication endpoints

**Knowledge**

Mounted by Devise under `/api/v1/users`:

| Method | Path | Auth | Success | Notes |
|---|---|---|---|---|
| POST | `/api/v1/users` | none | `201` | Register. Body `{ user: { first_name, last_name, email, password } }`. Returns `{ message, data }`; `data` is the whitelisted user payload. Validation errors return `422` with `{ message }`. |
| POST | `/api/v1/users/sign_in` | none | `200` | Body `{ user: { email, password } }`. JWT is returned in the **response header** `authorization: Bearer <jwt>`, not in the body. |
| DELETE | `/api/v1/users/sign_out` | JWT | `200` | `{ message }`; `401` when there is no active session. |

The frontend must send `Authorization: Bearer <jwt>` (or the raw header value, which already starts with `Bearer `). Never add `Bearer` twice.

**Use When**

Implementing login/logout/signup or debugging 401s on protected calls.

**Source**

- `backend/config/routes.rb`
- `backend/app/controllers/api/v1/users/registrations_controller.rb`
- `backend/app/controllers/api/v1/users/sessions_controller.rb`

**Last Verified**

2026-10-26

## Public content endpoints

**Knowledge**

- `GET /api/v1/courses` → `200`, array of `{ id, title, slug }`, ordered by `position` then `created_at`.
- `GET /api/v1/courses/:course_id/topics` → `200`, array of `{ id, title, slug, level }`, ordered by `position`. `:course_id` accepts either a BSON ObjectId or the course **slug**; unknown values raise `Mongoid::Errors::DocumentNotFound`.
- `GET /api/v1/topics/:topic_id/questions` → `200` with `{ questions: [...], meta: { current_page, per_page, total_pages, total_count } }`. Query params: `level` (`low|medium|hard`, ignored when invalid), `sort=upvotes`, `page` (min 1), `per_page` (default 10, clamped to 1..50). Each question includes `id, title, answer, level, topic_id, upvote_count, bookmarked_by_current_user, upvoted_by_current_user`. Missing topic → `404 { error: "Topic not found" }`.

These routes are handled by admin-namespaced controllers with authentication skipped, but per-user booleans still resolve when a valid token is sent.

**Use When**

Tracing how the public site loads content, or changing pagination/filtering.

**Source**

- `backend/app/controllers/api/v1/admin/courses_controller.rb#index`
- `backend/app/controllers/api/v1/admin/topics_controller.rb#index`
- `backend/app/controllers/api/v1/admin/questions_controller.rb#index`
- `frontend/src/apis/content.js`

**Last Verified**

2026-10-26

## Authenticated interaction endpoints

**Knowledge**

All require `Authorization: Bearer <jwt>` (else `401`).

- `GET /api/v1/bookmarks` → `200`, `{ courses: [ { id, title, slug, topics: [ { id, title, slug, level, questions: [...] } ] } ] }`, grouped and sorted by position then title.
- `POST /api/v1/questions/:question_id/bookmark` → `201` `{ bookmarked_by_current_user: true, bookmark_id, question_id }`. Idempotent (`find_or_create_by!`); missing question → `404 { error }`.
- `DELETE /api/v1/questions/:question_id/bookmark` → `200` `{ bookmarked_by_current_user: false, question_id }`; deleting a non-existent bookmark still returns success.
- `POST /api/v1/questions/:question_id/upvote` → `201` `{ upvoted_by_current_user: true, upvote_count, question_id }`; repeated calls do not double-count.
- `DELETE /api/v1/questions/:question_id/upvote` → `200` `{ upvoted_by_current_user: false, upvote_count, question_id }`; counter never goes below zero.

`current_user` scoping is what prevents cross-user access to bookmarks/upvotes.

**Use When**

Changing bookmark/upvote behavior or the bookmarks page.

**Source**

- `backend/app/controllers/api/v1/bookmarks_controller.rb`
- `backend/app/controllers/api/v1/upvotes_controller.rb`
- `frontend/src/apis/content.js`
- `frontend/src/pages/BookmarkedItems.jsx`

**Last Verified**

2026-10-26

## Admin endpoints

**Knowledge**

All `/api/v1/admin/*` routes require an admin JWT (non-admin → `403 { error: "Forbidden: Admin access only" }`, no token → `401`), except the three `index` actions that back the public routes above.

| Area | Endpoints | Success statuses |
|---|---|---|
| Users | `GET/POST /admin/users`, `PATCH /admin/users/:id`, `DELETE /admin/users/:id` | `200` / `201` / `200` / `204` |
| Courses | `GET/POST /admin/courses`, `PATCH/DELETE /admin/courses/:id`, `POST /admin/courses/reorder` | `200` / `200` / `200` / `204` / `200` |
| Topics | `GET/POST /admin/topics`, `PATCH/DELETE /admin/topics/:id`, `POST /admin/topics/reorder` | `200` / `200` / `200` / `204` / `200` |
| Questions | `GET /admin/topics/:topic_id/questions`, `POST /admin/questions`, `PATCH/DELETE /admin/questions/:id`, `POST /admin/questions/reorder` | `200` / `200` / `200` / `204` / `200` |

Create/update params are read directly from `params` (top-level keys such as `title`, `slug`, `level`, `answer`, `role`), not nested under a resource key. Reorder bodies: `{ course_ids }`, `{ topic_ids }`, or `{ question_ids, topic_id }` — each array must contain the complete ordered set, and positions are rewritten as `index + 1`.

Custom errors use `{ error: "..." }`; Devise's unauthenticated response is plain text `"You need to sign in or sign up before continuing."`.

**Use When**

Adding admin UI actions or changing management endpoints.

**Source**

- `backend/config/routes.rb`
- `backend/app/controllers/api/v1/admin/*.rb`
- `frontend/src/apis/course_manager.js`
- `frontend/src/apis/users.js`

**Last Verified**

2026-10-26
