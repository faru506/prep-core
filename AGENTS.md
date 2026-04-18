# AGENTS.md

## Dev Commands

### Docker-based stack (primary)
```bash
make start          # Start all containers
make stop           # Stop (keeps DB)
make restart        # Restart containers
make logs           # View all logs
make logs-backend   # View Rails logs
make logs-frontend  # View React logs
make rails          # Open Rails console
make migrate        # Run migrations
make seed           # Seed database
make reset-db       # ⚠️ Deletes DB, recreates
make rebuild        # Force rebuild without cache
make clean          # Remove containers (keeps DB)
make ps            # Show running containers
```

### Linting
```bash
make lint-frontend  # Run ESLint on frontend (npm run lint)
make lint-backend   # Run RuboCop on backend (bundle exec rubocop)
make lint           # Run both linters
```

### Frontend Management
```bash
# Inside container or locally
npm run dev     # Start Vite dev server (port 5173)
npm run build   # Production build
npm run lint    # ESLint check
npm run preview # Preview production build

# Using Makefile for container operations
make npm-install               # Install all packages in container
make npm-add pkg=package_name   # Install specific package in container
```

### Backend Management
```bash
# Inside container or locally
rails console
bundle exec rubocop
bundle exec rubocop -A  # Auto-fix offenses
```

## Stack

- **Frontend**: React 19 + Vite + TailwindCSS v4 + TipTap + dnd-kit + Lucide-React + PrismJS + DOMPurify
- **Backend**: Rails 8.1.3 + Ruby 3.4.1 + MongoDB 7 (Mongoid)
- **Auth**: JWT via Devise (routes under `/api/v1/users`)
- **Testing**: RSpec (backend only)

## Architecture

- Monorepo: `frontend/` and `backend/` directories
- `docker-compose.dev.yml` defines all services
- Rails API at `localhost:3000`, frontend at `localhost:5173`

## API Routes

### Authentication
- `POST /api/v1/users/sign_up`
- `POST /api/v1/users/sign_in`

### Admin API (`/api/v1/admin`)
- **Users**: `GET`, `POST`, `PUT/PATCH`, `DELETE` `/api/v1/admin/users`
- **Courses**: `GET`, `POST`, `PUT/PATCH`, `DELETE` `/api/v1/admin/courses`
- **Topics**: `GET`, `POST`, `PUT/PATCH`, `DELETE` `/api/v1/admin/topics`
- **Questions**: `POST`, `PUT/PATCH`, `DELETE` `/api/v1/admin/questions`
- **Nested**: `GET /api/v1/admin/topics/:topic_id/questions`
- **Reordering**: `POST /api/v1/admin/{courses|topics|questions}/reorder`

### Public API
- **Courses**: `GET /api/v1/courses`
- **Topics**: `GET /api/v1/courses/:course_id/topics`
- **Questions**: `GET /api/v1/topics/:topic_id/questions` (Params: `level`, `page`)

## Code Quality

- **Backend**: RuboCop for Ruby linting (`make lint-backend`)
- **Frontend**: ESLint for JavaScript/React (`make lint-frontend`)
- Both can be run together with `make lint`

## Course Content

- **Courses**: Ruby, Rails, React, JavaScript, System Design
- **Topic Levels**: 
  - `low` (SDE 1 - Foundations)
  - `medium` (SDE 2 - Intermediate Mastery)
  - `hard` (SDE 3 - Expert & Architecture)

## State Management

- Local state (`useState`) and `localStorage` (via `utilities/storage`) for auth and roles.
- Redux is intentionally omitted as the current scale does not justify the boilerplate.

## React Patterns

- Standard hooks (`useState`, `useEffect`, `useRef`) are used.
- `useMemo` and `useCallback` are avoided unless performance bottlenecks are identified.
- Custom hooks should be implemented to encapsulate repetitive data fetching logic.

## CI Pipeline

- **Backend**: Installs dependencies in `backend/` directory, then runs tests, RuboCop linting, and security scans (Brakeman, Bundler Audit)
- **Frontend**: Installs dependencies in `frontend/` directory, then runs build process
- Triggered on push to `main` and all pull requests

## Gotchas

- Frontend has no TypeScript config (plain JS)
- MongoDB volumes persist across container restarts
- Frontend `node_modules` are in an anonymous volume; use `make npm-install` or `make npm-add` to manage packages in the container
- Use `make rebuild` to force rebuild without cache
- Run `make lint` before committing to catch style issues.
- After any code change, the model MUST run the relevant lint and test commands to verify the changes.
- Whenever a task is assigned to an AI model, the model MUST first read AGENTS.md to gather codebase context and conventions.
- Whenever changes are made to the codebase, the model MUST update AGENTS.md to reflect those changes.
