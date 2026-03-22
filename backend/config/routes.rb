Rails.application.routes.draw do

  # ── Health check ─────────────────────────
  get '/health', to: 'application#health'

  # ── Devise JWT Auth ──────────────────────
  devise_for :users,
             path: 'api/v1',
             path_names: {
               sign_in: 'auth/sign_in',
               sign_out: 'auth/sign_out',
               registration: 'auth/sign_up'
             },
             controllers: {
               sessions: 'api/v1/sessions',
               registrations: 'api/v1/registrations'
             }

  namespace :api do
    namespace :v1 do

      post 'auth/refresh', to: 'tokens#refresh'
      resource :profile, only: [:show, :update]

      resources :problems, param: :slug
      resources :submissions
      resources :bookmarks

      resource :progress, only: [:show]

      resources :interview_topics, param: :slug do
        resources :interview_questions, shallow: true
      end

    end
  end

end