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

  it "keeps admin content reads admin-only" do
    topic = create(:topic)

    [ "/api/v1/admin/courses", "/api/v1/admin/topics?course_id=#{topic.course_id}",
      "/api/v1/admin/topics/#{topic.id}/questions" ].each do |path|
      get path, headers: { "Accept" => "application/json" }
      expect(response).to have_http_status(:unauthorized), path

      get path, headers: auth_headers_for(user)
      expect(response).to have_http_status(:forbidden), path

      get path, headers: auth_headers_for(admin)
      expect(response).to have_http_status(:ok), path
    end
  end

  it "gives admins every question in a topic, in position order, without pagination" do
    topic = create(:topic)
    create_list(:question, 12, topic: topic)

    get "/api/v1/admin/topics/#{topic.id}/questions", headers: auth_headers_for(admin)

    positions = json["questions"].map { |q| Question.find(q["id"]).position }
    expect(json["questions"].size).to eq(12)
    expect(positions).to eq(positions.sort)
  end

  it "lets admins list users without exposing password fields" do
    get "/api/v1/admin/users", headers: auth_headers_for(admin)

    expect(response).to have_http_status(:ok)
    expect(json.first.keys).to contain_exactly("id", "first_name", "last_name", "email", "role", "premium_until")
  end
end
