# Architecture Memory

## Monorepo runtime topology

**Knowledge**

`prep-core` is a two-app monorepo with no shared build step. `frontend/` is a React 19 SPA built by Vite and served by its own dev server on port `5173`. `backend/` is a Rails 8.1 API-only app (`ActionController::API`) serving on port `3000`. Persistence is MongoDB through Mongoid. `docker-compose.dev.yml` runs three containers: `rails_backend` (3000:3000), `react_frontend` (5173:5173), and `mongodb` (image `mongo:7`, not published to the host). Both app directories are bind-mounted, and frontend `node_modules` lives in an anonymous volume.

There is no reverse proxy: the browser calls the Rails API directly at `http://localhost:3000`, which is why CORS is required.

**Use When**

Reasoning about local startup, ports, CORS, container mounts, or where code executes.

**Source**

- `docker-compose.dev.yml`
- `backend/config/application.rb`
- `frontend/vite.config.js`
- `frontend/src/apis/config.js` (`DOMAIN`)

**Last Verified**

2026-10-26

## JWT authentication flow

**Knowledge**

Authentication uses Devise with `devise-jwt` and the `JTIMatcher` revocation strategy on `User`. Routes are mounted by `devise_for :users` under `api/v1/users`, so `POST /api/v1/users` registers and `POST /api/v1/users/sign_in` logs in. `User#jwt_payload` adds `email` and `role` claims. The signed JWT is returned in the **response header** `authorization: Bearer <jwt>` (not in the JSON body). Logout goes through `DELETE /api/v1/users/sign_out`.

On the client, the token is stored in `localStorage` under `token`. `getToken()` decodes the payload, removes the token when `exp` has passed, and returns `null`; `getRole()` reads the payload directly and does **not** enforce expiry. `apiFetch` removes the token and redirects to `/login` on any 401.

**Use When**

Changing login/logout, token storage, route guards, or any authenticated request.

**Source**

- `backend/app/models/user.rb`
- `backend/config/routes.rb`
- `backend/app/controllers/api/v1/users/sessions_controller.rb`
- `backend/app/controllers/api/v1/users/registrations_controller.rb`
- `frontend/src/utilities/storage.js`
- `frontend/src/apis/config.js`

**Last Verified**

2026-10-26

## Authorization layers

**Knowledge**

Authorization is split across three controller levels:

- `ApplicationController` defines `authorize_admin!`, which renders `403` with `{ error: "Forbidden: Admin access only" }` unless `current_user&.admin?`.
- `Api::V1::BaseController` adds `before_action :authenticate_user!` for authenticated-user endpoints (`bookmarks`, `upvotes`).
- `Api::V1::Admin::AdminController` adds both `authenticate_user!` and `authorize_admin!`.

Public read endpoints are implemented by the **admin-namespaced** controllers (`admin/courses#index`, `admin/topics#index`, `admin/questions#index`) which `skip_before_action` both filters. Public routes in `config/routes.rb` point at those same controllers. Changing the filters on those controllers affects both public and admin behavior.

**Use When**

Editing controllers, adding endpoints, or debugging 401/403 responses.

**Source**

- `backend/app/controllers/application_controller.rb`
- `backend/app/controllers/api/v1/base_controller.rb`
- `backend/app/controllers/api/v1/admin/admin_controller.rb`
- `backend/app/controllers/api/v1/admin/courses_controller.rb`
- `backend/app/controllers/api/v1/admin/topics_controller.rb`
- `backend/app/controllers/api/v1/admin/questions_controller.rb`
- `backend/config/routes.rb`

**Last Verified**

2026-10-26

## Frontend route map

**Knowledge**

`frontend/src/Router.jsx` uses `createBrowserRouter`:

- Public: `/login`, `/register` (both wrapped in `PublicRoute`).
- Layout `Root`: `/` (Home), `/interview_qa`, `/interview_qa/:courseSlug/:topicSlug?`, `/programs`, `/contests`.
- Auth-guarded: `/bookmarks` (`ProtectedRoute`).
- Admin-guarded: `/users`, `/course_manager` (both `AdminRoute`).
- Fallback `*`: redirects to `/` when `getToken()` exists, otherwise `/login`.

**Use When**

Adding screens, changing guards, or tracing navigation from the sidebar/navbar.

**Source**

- `frontend/src/Router.jsx`
- `frontend/src/routes/ProtectedRoute.jsx`
- `frontend/src/routes/AdminRoute.jsx`
- `frontend/src/routes/PublicRoute.jsx`

**Last Verified**

2026-10-26

## No service layer, no background processing

**Knowledge**

Business logic lives directly in controllers and models. There is no `app/services/` directory. `app/jobs/` contains only `ApplicationJob`, and no ActiveJob/Sidekiq adapter or worker process is configured or started by the Docker stack. `REDIS_URL` exists in `.env` but is not used by the running services. All reads/writes therefore execute synchronously inside the request cycle.

**Use When**

Deciding where new logic belongs, or investigating timeouts/latency.

**Source**

- `backend/app/jobs/application_job.rb`
- `backend/Gemfile`
- `docker-compose.dev.yml`
- `backend/.env`

**Last Verified**

2026-10-26
