Rails.application.routes.draw do

  devise_for :users,
    path: "api/v1/users",
    controllers: {
      sessions: "api/v1/users/sessions",
      registrations: "api/v1/users/registrations"
    }

  namespace :api do
    namespace :v1 do
      namespace :admin do
        resources :users, only: [:index]
      end
    end
  end
end
