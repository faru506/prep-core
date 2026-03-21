Rails.application.routes.draw do

  # ── Health check (no auth required) ───────────────────────────────────────
  get '/health', to: 'application#health'

  # ── Devise + JWT auth ──────────────────────────────────────────────────────
  devise_for :users,
             path: 'api/v1',
             path_names: {
               sign_in:      'auth/sign_in',
               sign_out:     'auth/sign_out',
               registration: 'users'
             },
             controllers: {
               sessions:      'api/v1/sessions',
               registrations: 'api/v1/registrations'
             }

  # ── API v1 ─────────────────────────────────────────────────────────────────
  namespace :api do
    namespace :v1 do

      # Token refresh
      post 'auth/refresh', to: 'tokens#refresh'

      # Current user profile
      resource :profile, only: [:show, :update]

      # ── Problems ────────────────────────────────────────────────────────────
      resources :problems, param: :slug, only: [:index, :show, :create, :update, :destroy]

      # ── Submissions ─────────────────────────────────────────────────────────
      resources :submissions, only: [:index, :create, :show]

      # ── Bookmarks ───────────────────────────────────────────────────────────
      resources :bookmarks, only: [:index, :create, :destroy]

      # ── User progress / dashboard data ──────────────────────────────────────
      resource :progress, only: [:show]

      # ── Interview Q&A ────────────────────────────────────────────────────────
      resources :interview_topics, param: :slug, only: [:index, :show] do
        resources :interview_questions, only: [:index, :show], shallow: true
      end

      # Admin CRUD for topics and questions
      namespace :admin do
        resources :interview_topics do
          resources :interview_questions
        end
      end

      # Helpful vote on a question (e.g. "was this answer helpful?")
      post 'interview_questions/:id/helpful', to: 'interview_questions#mark_helpful'

      # ── Filter helpers (used by frontend dropdowns) ──────────────────────────
      get 'problems/meta/categories', to: 'problems#categories'
      get 'problems/meta/companies',  to: 'problems#companies'
      get 'problems/meta/tags',       to: 'problems#tags'

      # ── Admin namespace ──────────────────────────────────────────────────────
      namespace :admin do
        # Overview stats
        get 'dashboard', to: 'dashboard#stats'

        # User management
        resources :users, only: [:index, :show, :update, :destroy]

        # Problem management (full CRUD)
        resources :problems, param: :slug

        # Interview topic + question management (full CRUD)
        resources :interview_topics, param: :slug do
          resources :interview_questions, except: [:new, :edit]
          patch 'toggle_active', to: 'interview_topics#toggle_active'
        end

        # Bulk import from .rb files
        post 'import/problems',            to: 'imports#problems'
        post 'import/interview_questions', to: 'imports#interview_questions'
      end

    end
  end

end