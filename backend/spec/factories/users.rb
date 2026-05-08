FactoryBot.define do
  factory :user do
    name { "Admin User" }
    email { "admin@example.com" }
    password { "password123" }
    role { :admin }
    active { true }
  end
end
