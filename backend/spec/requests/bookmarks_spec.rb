require "rails_helper"

RSpec.describe "Bookmarks", type: :request do
  let(:user) { create(:user) }
  let(:question) { create(:question) }
  let(:headers) { auth_headers_for(user) }

  it "requires authentication" do
    post "/api/v1/questions/#{question.id}/bookmark", headers: { "Accept" => "application/json" }

    expect(response).to have_http_status(:unauthorized)
  end

  it "creates a bookmark idempotently" do
    2.times { post "/api/v1/questions/#{question.id}/bookmark", headers: headers }

    expect(response).to have_http_status(:created)
    expect(user.bookmarks.count).to eq(1)
    expect(user.bookmarks.first.course).to eq(question.topic.course)
  end

  it "returns 404 for an unknown question" do
    post "/api/v1/questions/#{BSON::ObjectId.new}/bookmark", headers: headers

    expect(response).to have_http_status(:not_found)
  end

  it "removes a bookmark and succeeds when none exists" do
    post "/api/v1/questions/#{question.id}/bookmark", headers: headers
    2.times { delete "/api/v1/questions/#{question.id}/bookmark", headers: headers }

    expect(response).to have_http_status(:ok)
    expect(user.bookmarks.count).to eq(0)
  end

  it "lists only the current user's bookmarks grouped by course and topic" do
    post "/api/v1/questions/#{question.id}/bookmark", headers: headers
    other_question = create(:question)
    post "/api/v1/questions/#{other_question.id}/bookmark", headers: auth_headers_for(create(:user))

    get "/api/v1/bookmarks", headers: headers

    courses = json["courses"]
    expect(courses.size).to eq(1)
    expect(courses.first["topics"].first["questions"].map { |q| q["id"] }).to eq([ question.id.to_s ])
  end
end
