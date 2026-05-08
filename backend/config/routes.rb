Rails.application.routes.draw do
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"

      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"

      resources :users
      resources :room_categories
      resources :amenities, only: %i[index create update destroy]
      resources :rooms do
        patch :status, on: :member
      end

      resources :guests
      resources :reservations do
        get :calendar, on: :collection
        patch :cancel, on: :member
      end

      post "check_ins", to: "check_ins#create"
      post "check_outs", to: "check_outs#create"

      get "front_desk/live_status", to: "front_desk#live_status"
      post "front_desk/walk_ins", to: "front_desk#walk_in"
      resources :notifications, only: %i[index update]

      resources :housekeeping_tasks
      resources :maintenance_tickets

      resources :invoices do
        post :refund, on: :member
        resources :payments, only: %i[create]
      end

      resources :food_beverage_orders
      get "pareto_search", to: "search#index"

      get "reports/occupancy", to: "reports#occupancy"
      get "reports/revenue", to: "reports#revenue"
      get "reports/booking_trends", to: "reports#booking_trends"
    end
  end
end
