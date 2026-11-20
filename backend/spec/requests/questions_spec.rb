require "rails_helper"

RSpec.describe "Public questions", type: :request do
  let(:topic) { create(:topic) }
  let(:user) { create(:user) }

  describe "GET /api/v1/topics/:topic_id/questions" do
    it "is available without signing in and paginates" do
      create_list(:question, 12, topic: topic)

      get "/api/v1/topics/#{topic.id}/questions", params: { page: 2 }

      expect(response).to have_http_status(:ok)
      expect(json["questions"].size).to eq(2)
      expect(json["meta"]).to include("current_page" => 2, "total_pages" => 2, "total_count" => 12)
    end

    it "filters by level" do
      create(:question, topic: topic, level: "hard")
      create(:question, topic: topic, level: "low")

      get "/api/v1/topics/#{topic.id}/questions", params: { level: "hard" }

      expect(json["questions"].map { |q| q["level"] }).to eq([ "hard" ])
    end

    it "sorts by upvotes when requested" do
      create(:question, topic: topic, title: "Less", upvote_count: 1)
      create(:question, topic: topic, title: "More", upvote_count: 5)

      get "/api/v1/topics/#{topic.id}/questions", params: { sort: "upvotes" }

      expect(json["questions"].map { |q| q["title"] }).to eq(%w[More Less])
    end

    it "flags the signed-in user's bookmarks and upvotes" do
      question = create(:question, topic: topic)
      create(:bookmark, user: user, question: question, topic: topic, course: topic.course)
      create(:upvote, user: user, question: question)

      get "/api/v1/topics/#{topic.id}/questions", headers: auth_headers_for(user)

      expect(json["questions"].first).to include(
        "bookmarked_by_current_user" => true,
        "upvoted_by_current_user" => true
      )
    end

    it "returns 404 for an unknown topic" do
      get "/api/v1/topics/#{BSON::ObjectId.new}/questions"

      expect(response).to have_http_status(:not_found)
    end
  end
end
