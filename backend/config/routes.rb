Rails.application.routes.draw do
  # ── Devise JWT Auth ──────────────────────
  devise_for :users, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  namespace :api do
    namespace :v1 do
      resources :challenges
    end
  end
end
