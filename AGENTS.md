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

- **Frontend**: React 19 + Vite + TailwindCSS v4 + dnd-kit + Lucide-React + React Markdown
- **Backend**: Rails 8.1.3 + Ruby 3.4.1 + MongoDB 7 (Mongoid)
- **Auth**: JWT via Devise (routes under `/api/v1/users`)
- **Testing**: RSpec (backend only)

## Architecture

- Monorepo: `frontend/` and `backend/` directories
- `docker-compose.dev.yml` defines all services
- Rails API at `localhost:3000`, frontend at `localhost:5173`
- Root `README.md` is the canonical project documentation; subfolder README files may be stale templates unless updated explicitly.

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
- **Bookmarks**: `GET /api/v1/bookmarks`
- **Question Interactions**:
  - `POST /api/v1/questions/:question_id/bookmark`
  - `DELETE /api/v1/questions/:question_id/bookmark`
  - `POST /api/v1/questions/:question_id/upvote`
  - `DELETE /api/v1/questions/:question_id/upvote`
- Use generic resource names for interaction files and models:
  - `Bookmark` / `bookmarks_controller.rb`
  - `Upvote` / `upvotes_controller.rb`
  - avoid `question_bookmark`, `question_upvote`, or similar prefixed naming

## Code Quality

- **Backend**: RuboCop for Ruby linting (`make lint-backend`)
- **Frontend**: ESLint for JavaScript/React (`make lint-frontend`)
- Both can be run together with `make lint`

## Course Content Generation Workflow

When asked to populate courses, topics, and questions from an image or list:

1.  **Analyze Input**: Identify the Course title, Level (SDE 1/2/3), and Topics/Sub-topics.
2.  **Plan Content**:
    - Create at least 10 questions per topic.
    - Distribute questions across `low`, `medium`, and `hard` levels.
    - Craft answers in **Markdown format**, including:
      - short paragraphs for explanation
      - `-` lists for key points
      - `**bold**` for emphasis
      - fenced code blocks such as ```` ```ruby ```` for all code examples
3.  **Implement Seeding**:
    - Create a **single** temporary Ruby seed script (e.g., `backend/seed_<course>_<level>.rb`).
    - Use `find_or_create_by!` for `Course` and `Topic` to avoid duplicates.
    - Use `find_or_create_by!` for `Question` and check for existing `Answer` before creating/updating.
    - Use **single quotes** for the outer string in Ruby seed scripts to avoid interpolation errors with `#{}`.
4.  **Execute and Verify**:
    - Run the script: `docker compose -f docker-compose.dev.yml exec backend bundle exec rails runner <script_path>`.
    - Verify data in the UI or via Rails console.
5.  **Cleanup**: Remove the seed script after successful verification.

## State Management
 
- Local state (`useState`) and `localStorage` (via `utilities/storage`) for auth and roles.
- Redux is intentionally omitted as the current scale does not justify the boilerplate.
- `InterviewQA` reads bookmark/upvote state from the backend question payload; bookmark is user-specific and upvote uses a persisted per-user toggle plus question-level aggregate count.
- `InterviewQA` and `Bookmarked Items` use a question dropdown with `low`, `medium`, `hard`, and `upvote`; `upvote` sorts by `upvote_count` descending, while level selections keep the default content order.

## Session & Auth

- **Global 401 Handling**: `apiFetch` in `frontend/src/apis/config.js` automatically removes the token and redirects to `/login` on any 401 Unauthorized response.
- **Token Expiration**: `getToken` in `frontend/src/utilities/storage.js` checks the JWT `exp` claim and clears the token if expired.
- **Navigation Utility**: `frontend/src/utilities/navigation.js` provides a way to trigger redirects from outside React components (used by the global 401 handler).
- **Route Guards**:
  - `ProtectedRoute`: Redirects to `/login` if no valid token exists.
  - `AdminRoute`: Redirects to `/login` if the role is missing, or to `/` if the user is not an admin.


## React Patterns

- Standard hooks (`useState`, `useEffect`, `useRef`) are used.
- `useMemo` and `useCallback` are avoided unless performance bottlenecks are identified.
- Custom hooks should be implemented to encapsulate repetitive data fetching logic.
- Shared presentational logic for question reading views should be centralized in reusable components/utilities instead of duplicated across `InterviewQA` and `Bookmarked Items`.
- Admin question editing now uses a Markdown-only `Write`/`Preview` editor, and InterviewQA/Bookmarked Items must render answers through the same shared Markdown renderer so preview and read views stay visually identical.

## Performance Optimizations

### UI Scrolling Performance
- **Issue**: Rapid scrolling caused UI deflection, black screens, and flickering
- **Root Causes**:
  - Long CSS transitions (`transition-all duration-500`) causing visual artifacts
  - CPU-intensive ReactMarkdown parsing on every render
  - GPU-heavy backdrop blur effects slowing down rendering
  - No debouncing on expensive operations (IntersectionObserver)
- **Solutions Implemented**:
  - Reduced CSS transition durations (300-500ms → 150-200ms)
  - Changed from `transition-all` to `transition-colors` to minimize repaints
  - Removed expensive backdrop blur effects (`backdrop-blur-xl`)
  - Added React.memo to QuestionCards component to prevent unnecessary re-renders
  - Optimized IntersectionObserver with debouncing and better thresholds
  - Added CSS optimizations with `optimize-scrolling` class for GPU acceleration
- **Files Modified**:
  - `frontend/src/components/QuestionCards.jsx` - Performance optimizations
  - `frontend/src/pages/InterviewQA.jsx` - Observer optimizations
  - `frontend/src/index.css` - Scroll optimization CSS

### Best Practices for Smooth Scrolling:
1. Avoid `transition-all` - use specific property transitions
2. Keep CSS transition durations under 200ms for interactive elements
3. Use `React.memo` for expensive list components
4. Debounce expensive operations during rapid user interactions
5. Minimize GPU-intensive effects (backdrop filters, heavy shadows) in scrollable areas

## CI Pipeline

- **Backend**: Installs dependencies in `backend/` directory, then runs tests, RuboCop linting, and security scans (Brakeman, Bundler Audit)
- **Frontend**: Installs dependencies in `frontend/` directory, then runs build process
- Triggered on push to `main` and all pull requests

## Data Safety & Deployment

- **Environment Separation**: Always use different MongoDB databases/clusters for development and production.
- **URI Management**: Use the `MONGODB_URI` environment variable across all environments. While the key is the same, the value must differ (e.g., local Docker URI for development, Atlas/Cloud URI for production) to ensure absolute data isolation.
- **Local Dev**: Use a local MongoDB instance (via Docker) or a dedicated Dev cluster.
- **Production**: Use MongoDB Atlas with strict RBAC (Role-Based Access Control) to prevent accidental `dropDatabase` operations.
- **Backups**: Production data should be backed up via MongoDB Atlas Cloud Backups.
- **Destructive Commands**: `make reset-db` deletes all local volumes and MUST NOT be run against production data.

## Gotchas

- Frontend has no TypeScript config (plain JS)
- MongoDB volumes persist across container restarts
- Frontend `node_modules` are in an anonymous volume; use `make npm-install` or `make npm-add` to manage packages in the container
- Use `make rebuild` to force rebuild without cache
- Run `make lint` before committing to catch style issues.
- After any code change, the model MUST run the relevant lint and test commands to verify the changes.
- Whenever a task is assigned to an AI model, the model MUST first read AGENTS.md to gather codebase context and conventions.
- Whenever changes are made to the codebase, the model MUST update AGENTS.md to reflect those changes.
