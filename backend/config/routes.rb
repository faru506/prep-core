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
        resources :courses, only: [:index, :create, :update, :destroy]
        resources :topics, only: [:index, :create, :update, :destroy] do
          resources :questions, only: [:index]
        end 
        resources :questions, only: [:create, :update, :destroy]
        post "courses/reorder", to: "courses#reorder"
        post "topics/reorder", to: "topics#reorder"
        post "questions/reorder", to: "questions#reorder"
      end

      resources :courses, only: [:index] do
        resources :topics, only: [:index]
      end

      resources :topics, only: [] do
        resources :questions, only: [:index]
      end

    end
  end
end
