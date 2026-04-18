# AGENTS.md

## Dev Commands

### Docker-based stack (primary)
```bash
make start          # Start all containers
make stop           # Stop (keeps DB)
make logs-backend  # View Rails logs
make logs-frontend # View React logs
make rails         # Open Rails console
make migrate       # Run migrations
make seed          # Seed database
make reset-db      # ⚠️ Deletes DB, recreates
make rebuild       # Force rebuild without cache
```

### Linting
```bash
make lint-frontend  # Run ESLint on frontend (npm run lint)
make lint-backend   # Run RuboCop on backend (bundle exec rubocop)
make lint           # Run both linters
```

### Frontend (inside container or locally)
```bash
npm run dev     # Start Vite dev server (port 5173)
npm run build  # Production build
npm run lint   # ESLint check
npm run preview # Preview production build
```

### Backend (inside container or locally)
```bash
rails console
bundle exec rubocop
bundle exec rubocop -A  # Auto-fix offenses
```

## Stack

- **Frontend**: React 19 + Vite + TailwindCSS v4 + TipTap + dnd-kit
- **Backend**: Rails 8.1 + Ruby 3.4.1 + MongoDB 7 (Mongoid)
- **Auth**: JWT via Devise (routes under `/api/v1/users`)
- **Testing**: RSpec (backend only)

## Architecture

- Monorepo: `frontend/` and `backend/` directories
- `docker-compose.dev.yml` defines all services
- Rails API at `localhost:3000`, frontend at `localhost:5173`

## API Routes
 
- Auth: `POST /api/v1/users/sign_up`, `POST /api/v1/users/sign_in`
- Admin: `/api/v1/admin/*` (courses, topics, questions CRUD)
- Public: 
  - `GET /api/v1/courses`
  - `GET /api/v1/courses/:course_id/topics`
  - `GET /api/v1/topics/:topic_id/questions` (Params: `level`, `page`)
- Admin endpoints now require JWT Authorization header in the frontend.

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

## Gotchas

- CI runs `bundle exec rails test || true` - tests don't fail CI
- Frontend has no TypeScript config (plain JS)
- MongoDB volumes persist across container restarts
- Frontend node_modules are in an anonymous volume; run `docker compose -f docker-compose.dev.yml exec frontend npm install <package>` to add dependencies to the container
- Use `make rebuild` to force rebuild without cache
- ESLint requires `--legacy-peer-deps` when installing packages
- Run `make lint` before committing to catch style issues
- Whenever changes are made to the codebase, update AGENTS.md to reflect the changes.