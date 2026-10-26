# Patterns Memory

## Frontend API client pattern

**Knowledge**

Every backend call goes through a thin module in `frontend/src/apis/` (`authentication.js`, `content.js`, `course_manager.js`, `users.js`, `config.js`). All of them call `apiFetch`, which centralizes 401 handling: it removes the token, navigates to `/login`, and throws `Error("Unauthorized")`.

Authenticated calls build `Authorization: Bearer ${getToken()}`. `content.js` defines a local `authHeaders()` helper; `course_manager.js` builds the header inline and also sets `Content-Type: application/json`. `authentication.js` and `users.js` follow their own local style. There is no shared header helper across modules — reuse the existing per-module style rather than introducing a cross-cutting wrapper.

**Use When**

Adding or changing an API call in the frontend.

**Source**

- `frontend/src/apis/config.js`
- `frontend/src/apis/content.js`
- `frontend/src/apis/course_manager.js`
- `frontend/src/utilities/storage.js`

**Last Verified**

2026-10-26

## Position and reorder pattern

**Knowledge**

Ordering is stored as an integer `position` scoped to the parent (`Course` is global, `Topic` within a course, `Question` within a topic).

- Create appends at the end: courses and questions use `parent.max(:position).to_i + 1`; topics use `course.topics.count + 1`.
- Destroy shifts siblings down by decrementing records with `position > destroyed_position`, one `inc(-1)` per record.
- Reorder accepts the full ordered id array and writes `position = index + 1` for each id.

The frontend sends `{ course_ids: [...] }`, `{ topic_ids: [...] }`, or `{ question_ids: [...], topic_id }` to `POST /api/v1/admin/{courses|topics|questions}/reorder`.

**Use When**

Changing creation, deletion, or drag-and-drop reordering so ordering stays consistent across all three levels.

**Source**

- `backend/app/controllers/api/v1/admin/courses_controller.rb`
- `backend/app/controllers/api/v1/admin/topics_controller.rb`
- `backend/app/controllers/api/v1/admin/questions_controller.rb`
- `frontend/src/apis/course_manager.js`
- `frontend/src/components/Sortable/SortableCourse.jsx`
- `frontend/src/components/Sortable/SortableTopic.jsx`

**Last Verified**

2026-10-26

## Hand-written JSON responses (no serializer layer)

**Knowledge**

Controllers render explicit hashes; no serializer classes are used even though `jsonapi-serializer` is in the Gemfile. `User` is never returned whole: admin and auth responses use a private `user_payload` that whitelists `id`, `first_name`, `last_name`, `email`, `role`. Question payloads expose `id`, `title`, `answer`, `level`, `topic_id`, `upvote_count`, and the two per-user booleans. Any new field must be added deliberately in each relevant payload.

**Use When**

Adding fields to an API response or changing response shapes. Keep the admin and public payloads consistent with what the frontend reads.

**Source**

- `backend/app/controllers/api/v1/admin/users_controller.rb#user_payload`
- `backend/app/controllers/api/v1/users/registrations_controller.rb#user_payload`
- `backend/app/controllers/api/v1/users/sessions_controller.rb#user_payload`
- `backend/app/controllers/api/v1/bookmarks_controller.rb`
- `backend/app/controllers/api/v1/admin/questions_controller.rb#index`

**Last Verified**

2026-10-26

## React rendering and state conventions

**Knowledge**

State is local `useState` plus `localStorage` (no Redux, no context store). `QuestionCards.jsx` is wrapped in `React.memo` for list rendering; `InterviewQA` paginates 10 questions per page and filters by level or upvotes. Answers are rendered through the shared `MarkdownPreview` component (`react-markdown` + `remark-gfm` + `rehype-raw` + DOMPurify) in both public and admin views, so there is a single Markdown rendering path.

**Use When**

Touching question rendering, filtering, pagination, or Markdown output.

**Source**

- `frontend/src/components/QuestionCards.jsx`
- `frontend/src/components/Editor/MarkdownPreview.jsx`
- `frontend/src/pages/InterviewQA.jsx`
- `frontend/src/pages/BookmarkedItems.jsx`
- `frontend/src/utilities/questions.js`

**Last Verified**

2026-10-26
