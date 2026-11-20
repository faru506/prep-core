require "rails_helper"

RSpec.describe "Authentication", type: :request do
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "POST /api/v1/users/sign_up" do
    let(:params) do
      { user: { first_name: "Ada", last_name: "Lovelace", email: "Ada@Example.com", password: "Password1!" } }
    end

    it "creates a regular user and returns a safe payload" do
      post "/api/v1/users", params: params.to_json, headers: json_headers

      expect(response).to have_http_status(:created)
      expect(json["data"].keys).to contain_exactly("id", "first_name", "last_name", "email", "role")
      expect(json["data"]).to include("email" => "ada@example.com", "role" => "user")
    end

    it "ignores a role param so users cannot self-promote" do
      post "/api/v1/users", params: params.deep_merge(user: { role: "admin" }).to_json, headers: json_headers

      expect(User.find_by(email: "ada@example.com")).not_to be_admin
    end

    it "rejects a weak password" do
      post "/api/v1/users", params: params.deep_merge(user: { password: "password" }).to_json, headers: json_headers

      expect(response).to have_http_status(:unprocessable_content)
      expect(User.count).to eq(0)
    end
  end

  describe "POST /api/v1/users/sign_in" do
    let!(:user) { create(:user, email: "ada@example.com") }

    it "returns a bearer token for valid credentials" do
      post "/api/v1/users/sign_in",
           params: { user: { email: "ada@example.com", password: "Password1!" } }.to_json,
           headers: json_headers

      expect(response).to have_http_status(:ok)
      expect(response.headers["Authorization"]).to start_with("Bearer ")
      expect(json["data"]).not_to have_key("encrypted_password")
    end

    it "rejects an invalid password" do
      post "/api/v1/users/sign_in",
           params: { user: { email: "ada@example.com", password: "Wrong1!pass" } }.to_json,
           headers: json_headers

      expect(response).to have_http_status(:unauthorized)
      expect(response.headers["Authorization"]).to be_nil
    end
  end
end
