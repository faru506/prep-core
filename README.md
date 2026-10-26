# PrepCore

PrepCore is a full-stack interview preparation platform built as a monorepo with a React frontend and a Rails API backend backed by MongoDB. It combines a learner-facing reading experience for interview Q&A with an admin workflow for managing courses, topics, questions, and users.

This README is the canonical project guide for the repository.

## What The Project Does

PrepCore currently provides two main experiences:

1. Learner experience
   - Browse interview content by course and topic.
   - Filter questions by difficulty: `low`, `medium`, `hard`, or `upvote`.
   - Bookmark questions per user.
   - Upvote questions as a signed-in user.
   - View a dedicated `Bookmarked Items` page that groups bookmarked questions by course and topic.

2. Admin experience
   - Manage users.
   - Create, edit, delete, and reorder courses.
   - Create, edit, delete, and reorder topics.
   - Create, edit, delete, and reorder questions.
   - Use a rich text editor for question answers.
   - Confirm destructive actions and reordering with modal dialogs.

## Current Feature Set

### Public / Learner Features

- Landing page for signed-out users
- Registration and login
- Interview Q&A reader
- Course tabs and topic sidebar
- Question filtering by:
  - `Low`
  - `Medium`
  - `Hard`
  - `Upvote`
- Bookmark toggle on questions
- Upvote toggle on questions
- Bookmarked Items page for authenticated users
- Syntax-highlighted answer rendering

### Admin Features

- Admin-only Users page
  - list users
  - search users
  - sort users
  - paginate users
  - create, edit, delete users
- Admin-only Course Manager
  - create, edit, delete courses
  - create, edit, delete topics
  - create, edit, delete questions
  - drag-and-drop reorder for courses, topics, and questions
  - confirmation dialogs for delete and reorder actions
  - level selection for topics and questions
  - rich text editor for question answers

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router
- dnd-kit
- TipTap
- Lucide React
- PrismJS
- DOMPurify

### Backend

- Ruby 3.4.1
- Rails 8.1.x API
- MongoDB 7
- Mongoid
- Devise
- devise-jwt
- Pundit
- RSpec scaffolded for backend testing

### Infrastructure / Dev Environment

- Docker
- Docker Compose
- Makefile-based local workflow

## Monorepo Structure

```text
.
├── backend/                # Rails API + Mongoid models + authentication
├── frontend/               # React app
├── docker-compose.dev.yml  # Local dev stack
├── Makefile                # Common development commands
└── README.md               # Main project documentation
```

## Application Architecture

### Frontend Routing

Main frontend routes are defined in [frontend/src/Router.jsx](./frontend/src/Router.jsx).

- `/`
  - home page if authenticated
  - landing page if not authenticated
- `/login`
- `/register`
- `/interview_qa`
- `/interview_qa/:courseSlug/:topicSlug?`
- `/bookmarks`
- `/programs`
- `/contests`
- `/users` (admin only)
- `/course_manager` (admin only)

### Backend Routing

Backend routes are defined in [backend/config/routes.rb](./backend/config/routes.rb).

#### Authentication

- `POST /api/v1/users/sign_in`
- `POST /api/v1/users`
- `DELETE /api/v1/users/sign_out`

#### Public Read APIs

- `GET /api/v1/courses`
- `GET /api/v1/courses/:course_id/topics`
- `GET /api/v1/topics/:topic_id/questions`
- `GET /api/v1/bookmarks`

#### Question Interaction APIs

- `POST /api/v1/questions/:question_id/bookmark`
- `DELETE /api/v1/questions/:question_id/bookmark`
- `POST /api/v1/questions/:question_id/upvote`
- `DELETE /api/v1/questions/:question_id/upvote`

#### Admin APIs

- `GET/POST/PATCH/DELETE /api/v1/admin/users`
- `GET/POST/PATCH/DELETE /api/v1/admin/courses`
- `GET/POST/PATCH/DELETE /api/v1/admin/topics`
- `POST/PATCH/DELETE /api/v1/admin/questions`
- `GET /api/v1/admin/topics/:topic_id/questions`
- `POST /api/v1/admin/courses/reorder`
- `POST /api/v1/admin/topics/reorder`
- `POST /api/v1/admin/questions/reorder`

## Domain Model

### Main content hierarchy

- `Course`
  - has many `Topic`
- `Topic`
  - belongs to `Course`
  - has many `Question`
  - has `level`
- `Question`
  - belongs to `Topic`
  - embeds one `Answer`
  - has `level`
  - has `upvote_count`
- `Answer`
  - embedded in `Question`

### User interaction models

- `Bookmark`
  - belongs to `User`
  - belongs to `Course`
  - belongs to `Topic`
  - belongs to `Question`
- `Upvote`
  - belongs to `User`
  - belongs to `Question`

This design allows:

- per-user bookmark state
- per-user upvote toggles
- aggregate `upvote_count` on each question for fast reads

## Difficulty Levels

Topics and questions support three content levels:

- `low`
- `medium`
- `hard`

In the current UI:

- level dots are color coded
- learner pages can filter by `low`, `medium`, `hard`, or `upvote`
- `upvote` is a display mode that sorts questions by `upvote_count`

## Local Development Setup

## Prerequisites

- Docker Desktop
- Docker Compose
- Make

Optional if you want to run things outside Docker:

- Node.js 20+
- npm
- Ruby 3.4.1
- Bundler
- MongoDB 7

## Environment Variables

The backend expects a JWT secret:

```env
JWT_SECRET=your-secret-value
```

If you use `dotenv-rails`, create:

```text
backend/.env
```

with:

```env
JWT_SECRET=replace-this-with-a-long-random-secret
```

Without this value, login/session JWT behavior can break.

## Start The Project

Primary local workflow:

```bash
make start
```

This starts:

- Rails API on `http://localhost:3000`
- React app on `http://localhost:5173`
- MongoDB in Docker

## Stop The Project

```bash
make stop
```

## Restart The Stack

```bash
make restart
```

## Rebuild Containers

```bash
make rebuild
```

## Check Running Services

```bash
make ps
```

## Logs

```bash
make logs
make logs-backend
make logs-frontend
```

## Database And Seed Workflow

### Seed users

```bash
make seed
```

Current seed data in [backend/db/seeds.rb](./backend/db/seeds.rb):

- creates sample users
- includes admin users
- uses `Password1!` for seeded passwords

### Migrations

```bash
make migrate
```

Note: this project uses Mongoid, so traditional SQL-style schema migrations are minimal compared to ActiveRecord projects.

### Reset database

```bash
make reset-db
```

Warning:

- this deletes the MongoDB volume
- all local data will be removed

## Useful Development Commands

### Docker / Make

```bash
make start
make stop
make restart
make logs
make logs-backend
make logs-frontend
make rails
make migrate
make seed
make reset-db
make rebuild
make clean
make ps
make npm-install
make npm-add pkg=package_name
make lint
make lint-frontend
make lint-backend
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
cd backend
rails console
bundle exec rubocop
bundle exec rubocop -A
bundle exec rspec
```

## Authentication Notes

- Authentication uses Devise + JWT.
- Frontend stores JWT in `localStorage`.
- Role information is also derived from the token payload.
- Protected learner feature:
  - `Bookmarked Items`
- Admin-only pages:
  - `Users`
  - `Course Manager`

## UI Behavior Notes

### Interview Q&A

- Base route resolves to the first available course.
- Topic list changes when a course changes.
- Question dropdown supports:
  - `Low`
  - `Medium`
  - `Hard`
  - `Upvote`
- Level modes preserve normal content order.
- Upvote mode sorts by highest `upvote_count`.

### Bookmarked Items

- Requires authentication
- Shows only bookmarked questions for the current user
- Groups content by course and topic
- Reuses the same reading-style card layout as the Interview Q&A flow
- Supports the same dropdown filtering behavior, including `Upvote`

### Course Manager

- Drag-and-drop reorder for:
  - courses
  - topics
  - questions
- Modal-based create/edit flows
- confirmation dialog for delete and reorder actions

### Users

- search
- sort
- pagination
- add/edit/delete modal workflow

## Quality Checks

### Lint

```bash
make lint
```

This runs:

- frontend ESLint
- backend RuboCop

### Tests

Backend test framework is present:

```bash
cd backend
bundle exec rspec
```

Current note:

- the test setup exists
- the repository may not yet contain meaningful backend specs beyond the scaffold baseline

## Known Gaps / Current Limitations

- Root README was previously missing; backend/frontend README files are still template-level and this root file is the primary source of truth.
- The app has placeholder marketing/product pages such as `Programs` and `Contests`.
- User profile/settings UI in the navbar is not fully implemented yet.
- There is no comprehensive automated test suite for the main feature flows yet.
- Frontend ESLint still reports one pre-existing warning in `frontend/src/Router.jsx` about `react-refresh/only-export-components`.
- The app currently relies on local JWT storage rather than a more advanced session strategy.

## Completed Work Summary

These capabilities are already implemented in the current repository:

- JWT-based login and registration
- public interview content browsing
- admin user management
- admin course/topic/question CRUD
- drag-and-drop reordering
- question rich text editing
- topic/question difficulty levels
- upvote interactions with aggregate counts
- per-user bookmarks
- dedicated bookmarked-items view
- confirmation dialogs for destructive/reorder operations

## Recommended Future Enhancements

### Product / UX

- complete the `Programs` and `Contests` sections
- build a real user profile/settings page
- add “My Upvoted Questions” or activity history
- add bookmark search and cross-course filtering
- add bookmark export/import
- improve empty/loading/error states across all pages

### Content / Learning

- add more seeded interview content
- support tags beyond course/topic/level
- add company-specific or role-specific question sets
- add curated learning paths
- add progress tracking per user

### Admin / Moderation

- add bulk import/export for course content
- add content approval/versioning workflow
- add admin analytics for popular questions and bookmark trends
- add audit history for content edits

### Engineering

- add meaningful backend request specs and model specs
- add frontend component/integration tests
- extract more shared client-side utilities/hooks
- improve serializer/presenter layering in the Rails API
- add environment examples such as `backend/.env.example`
- introduce CI checks for lint + tests + build in stricter form
- consider dedicated public controllers if public and admin behavior diverge more over time

## Troubleshooting

### Login works visually but authenticated actions fail

Check:

- `backend/.env` contains `JWT_SECRET`
- backend was restarted after changing JWT config
- user signs out and signs in again to refresh the token

### Frontend cannot talk to backend

Check:

- `make ps`
- backend is running on `localhost:3000`
- frontend is running on `localhost:5173`
- browser console and Rails logs

### Docker issues

Useful commands:

```bash
make logs
make logs-backend
make logs-frontend
make rebuild
make ps
```

### Lint issues

Run:

```bash
make lint
```

## Important Files

### Top-level

- [Makefile](./Makefile)
- [docker-compose.dev.yml](./docker-compose.dev.yml)

### Backend

- [backend/config/routes.rb](./backend/config/routes.rb)
- [backend/app/models/course.rb](./backend/app/models/course.rb)
- [backend/app/models/topic.rb](./backend/app/models/topic.rb)
- [backend/app/models/question.rb](./backend/app/models/question.rb)
- [backend/app/models/bookmark.rb](./backend/app/models/bookmark.rb)
- [backend/app/models/upvote.rb](./backend/app/models/upvote.rb)
- [backend/db/seeds.rb](./backend/db/seeds.rb)

### Frontend

- [frontend/src/Router.jsx](./frontend/src/Router.jsx)
- [frontend/src/pages/InterviewQA.jsx](./frontend/src/pages/InterviewQA.jsx)
- [frontend/src/pages/BookmarkedItems.jsx](./frontend/src/pages/BookmarkedItems.jsx)
- [frontend/src/pages/CourseManager.jsx](./frontend/src/pages/CourseManager.jsx)
- [frontend/src/pages/Users.jsx](./frontend/src/pages/Users.jsx)
- [frontend/src/components/Navbar.jsx](./frontend/src/components/Navbar.jsx)

## Contribution Notes

- Prefer `rg` for searching.
- Use `apply_patch` for manual code edits.
- Run relevant lint commands before finalizing changes.
- Keep admin and learner experiences visually and behaviorally consistent where possible.

## License / Ownership

No license file is currently present in the repository. Add one if this project is intended for open-source distribution.
