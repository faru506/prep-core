Rails.application.routes.draw do
  # ── Devise JWT Auth ──────────────────────
  devise_for :users, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  namespace :api do
    namespace :v1 do
      # post 'auth/refresh', to: 'tokens#refresh'
      # resource :profile, only: [:show, :update]

      # resources :problems, param: :slug
      # resources :submissions
      # resources :bookmarks

      # resource :progress, only: [:show]

      # resources :interview_topics, param: :slug do
      #   resources :interview_questions, shallow: true
      # end

      resources :challenges
    end
  end
end
