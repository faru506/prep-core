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
```

### Frontend (inside container or locally)
```bash
npm run dev     # Start Vite dev server (port 5173)
npm run build  # Production build
npm run lint   # ESLint check
```

### Backend (inside container or locally)
```bash
 rails console
 bundle exec rubocop
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
- Public: `/api/v1/courses`, `/api/v1/topics`, `/api/v1/questions`

## Gotchas

- CI runs `bundle exec rails test || true` - tests don't fail CI
- Frontend has no TypeScript config (plain JS)
- MongoDB volumes persist across container restarts
- Use `make rebuild` to force rebuild without cache