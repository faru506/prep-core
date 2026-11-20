require "rails_helper"

RSpec.describe "Upvotes", type: :request do
  let(:user) { create(:user) }
  let(:question) { create(:question) }
  let(:headers) { auth_headers_for(user) }

  it "requires authentication" do
    post "/api/v1/questions/#{question.id}/upvote", headers: { "Accept" => "application/json" }

    expect(response).to have_http_status(:unauthorized)
  end

  it "counts one upvote per user even when repeated" do
    2.times { post "/api/v1/questions/#{question.id}/upvote", headers: headers }

    expect(response).to have_http_status(:created)
    expect(json["upvote_count"]).to eq(1)
    expect(question.reload.upvote_count).to eq(1)
  end

  it "counts upvotes from different users" do
    post "/api/v1/questions/#{question.id}/upvote", headers: headers
    post "/api/v1/questions/#{question.id}/upvote", headers: auth_headers_for(create(:user))

    expect(question.reload.upvote_count).to eq(2)
  end

  it "decrements on removal and never goes below zero" do
    post "/api/v1/questions/#{question.id}/upvote", headers: headers
    2.times { delete "/api/v1/questions/#{question.id}/upvote", headers: headers }

    expect(json).to include("upvoted_by_current_user" => false, "upvote_count" => 0)
    expect(question.reload.upvote_count).to eq(0)
  end

  it "returns 404 for an unknown question" do
    post "/api/v1/questions/#{BSON::ObjectId.new}/upvote", headers: headers

    expect(response).to have_http_status(:not_found)
  end
end
