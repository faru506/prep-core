require "rails_helper"

RSpec.describe "Admin access", type: :request do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }

  it "rejects anonymous requests" do
    get "/api/v1/admin/users", headers: { "Accept" => "application/json" }

    expect(response).to have_http_status(:unauthorized)
  end

  it "forbids regular users" do
    get "/api/v1/admin/users", headers: auth_headers_for(user)

    expect(response).to have_http_status(:forbidden)
  end

  it "forbids regular users from creating content" do
    post "/api/v1/admin/courses", params: { title: "Hacked", slug: "hacked" }, headers: auth_headers_for(user)

    expect(response).to have_http_status(:forbidden)
    expect(Course.count).to eq(0)
  end

  it "lets admins list users without exposing password fields" do
    get "/api/v1/admin/users", headers: auth_headers_for(admin)

    expect(response).to have_http_status(:ok)
    expect(json.first.keys).to contain_exactly("id", "first_name", "last_name", "email", "role")
  end
end
