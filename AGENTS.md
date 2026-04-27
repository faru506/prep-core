# AGENTS.md

## 🚀 Quick Context
- **Project**: `prep-core` (Educational/Interview Prep Platform)
- **Architecture**: Monorepo (`frontend/` and `backend/`)
- **Stack**: 
  - **Frontend**: React 19 + Vite + TailwindCSS v4 + dnd-kit + Lucide-React + React Markdown
  - **Backend**: Rails 8.1.3 + Ruby 3.4.1 + MongoDB 7 (Mongoid)
  - **Auth**: JWT via Devise (routes under `/api/v1/users`)
  - **Infrastructure**: Docker (`docker-compose.dev.yml`)
- **Local URLs**: Rails API (`localhost:3000`), Frontend (`localhost:5173`)

## 🛠 Dev Commands

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

### Quality Control
```bash
make lint           # Run both frontend (ESLint) and backend (RuboCop) linters
make lint-frontend  # npm run lint
make lint-backend   # bundle exec rubocop
```

### Management
```bash
# Frontend (inside container/locally)
npm run dev         # Start Vite dev server
npm run build       # Production build
make npm-install    # Install packages in container
make npm-add pkg=X  # Install specific package in container

# Backend (inside container/locally)
rails console       # Interactive console
bundle exec rubocop -A # Auto-fix Ruby offenses
```

## 🌐 API Reference

### Authentication (`/api/v1/users`)
- `POST /sign_up`
- `POST /sign_in`

### Admin API (`/api/v1/admin`)
- **Users**: `GET`, `POST`, `PUT/PATCH`, `DELETE` `/users`
- **Courses**: `GET`, `POST`, `PUT/PATCH`, `DELETE` `/courses`
- **Topics**: `GET`, `POST`, `PUT/PATCH`, `DELETE` `/topics`
- **Questions**: `POST`, `PUT/PATCH`, `DELETE` `/questions`
- **Nested**: `GET /topics/:topic_id/questions`
- **Reordering**: `POST /{courses|topics|questions}/reorder`

### Public API (`/api/v1`)
- **Courses**: `GET /courses`
- **Topics**: `GET /courses/:course_id/topics`
- **Questions**: `GET /topics/:topic_id/questions` (Params: `level`, `page`)
- **Bookmarks**: `GET /bookmarks`
- **Interactions**:
  - `POST/DELETE /questions/:id/bookmark`
  - `POST/DELETE /questions/:id/upvote`

## 📝 Content Generation Workflow
When populating courses/topics/questions:
1. **Analyze**: Identify Course $\rightarrow$ Level (SDE 1/2/3) $\rightarrow$ Topics.
2. **Plan**: $\ge 10$ questions per topic, distributed across `low`, `medium`, `hard`.
3. **Format**: Answers must be **Markdown**. Use fenced code blocks (e.g., ` ```ruby `).
4. **Seed**: 
   - Use a temporary script: `backend/seed_<course>_<level>.rb`.
   - Use `find_or_create_by!` to prevent duplicates.
   - Use **single quotes** for outer strings in Ruby to avoid interpolation errors.
5. **Run**: `docker compose -f docker-compose.dev.yml exec backend bundle exec rails runner <script_path>`.
6. **Verify & Cleanup**: Check UI $\rightarrow$ Delete seed script.

## ⚙️ Technical Constraints & Patterns

### State & Auth
- **Frontend State**: `useState` + `localStorage` (via `utilities/storage`). No Redux.
- **Auth Logic**: 
  - `apiFetch` (frontend/src/apis/config.js) handles global 401 $\rightarrow$ `/login`.
  - `getToken` (frontend/src/utilities/storage.js) validates JWT expiration.
  - `ProtectedRoute` & `AdminRoute` handle navigation guards.

### React Patterns
- **Performance**: Use `React.memo` for list components (`QuestionCards.jsx`).
- **CSS**: Keep transitions $< 200\text{ms}$. Avoid `transition-all`; use `transition-colors`.
- **Rendering**: Use shared Markdown renderer for both Admin Edit and Public View.

### Performance Fixes (Applied)
- Removed `backdrop-blur-xl` and reduced transition durations to fix scrolling flickering/black screens.
- Optimized `IntersectionObserver` with debouncing in `InterviewQA.jsx`.

## 🛡 Critical Guardrails
1. **Data Isolation**: NEVER run `make reset-db` or destructive scripts against production. Use different `MONGODB_URI` for dev vs prod.
2. **Code Quality**: Run `make lint` before every commit.
3. **Security**: Never serialize the full `User` record in API responses.
4. **AI Protocol**: 
   - Read `AGENTS.md` at the start of every session.
   - Update `AGENTS.md` immediately after any architectural or API change.
   - Use `find_or_create_by!` for all seeding.

## ⚠️ Gotchas
- No TypeScript in frontend (Plain JS).
- Frontend `node_modules` are in anonymous volumes; use `make npm-install`.
- MongoDB volumes persist across restarts.
