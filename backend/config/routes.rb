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
        resources :users, only: [ :index, :create, :update, :destroy ]
        resources :courses, only: [ :index, :create, :update, :destroy ]
        resources :topics, only: [ :index, :create, :update, :destroy ] do
          resources :questions, only: [ :index ]
        end
        resources :questions, only: [ :create, :update, :destroy ]
        post "courses/reorder", to: "courses#reorder"
        post "topics/reorder", to: "topics#reorder"
        post "questions/reorder", to: "questions#reorder"
        resources :backups, only: [ :index, :create, :destroy ] do
          collection do
            post :restore
          end
          member do
            get :download
          end
        end
      end

      resources :courses, only: [ :index ], controller: "admin/courses" do
        resources :topics, only: [ :index ], controller: "admin/topics"
      end

      resources :topics, only: [] do
        resources :questions, only: [ :index ], controller: "admin/questions"
      end

      resources :bookmarks, only: [ :index ]

      resources :questions, only: [] do
        resource :bookmark, only: [ :create, :destroy ], controller: "bookmarks"
        resource :upvote, only: [ :create, :destroy ], controller: "upvotes"
      end
    end
  end
end
