require "rails_helper"

RSpec.describe "Api::V1::Auth", type: :request do
  describe "POST /api/v1/auth/login" do
    it "returns a JWT for valid credentials" do
      create(:user, email: "rspec-admin@raomeo.test", password: "password123")

      post "/api/v1/auth/login", params: { email: "rspec-admin@raomeo.test", password: "password123" }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig("data", "token")).to be_present
    end
  end
end
