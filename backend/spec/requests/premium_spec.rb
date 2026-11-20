require "rails_helper"

RSpec.describe "Premium content", type: :request do
  let(:topic) { create(:topic) }
  let!(:free_question) { create(:question, topic: topic, answer: Answer.new(content: "Free answer")) }
  let!(:premium_question) { create(:question, topic: topic, premium: true, answer: Answer.new(content: "Secret answer")) }

  def listed(headers = {})
    get "/api/v1/topics/#{topic.id}/questions", headers: headers
    json["questions"].index_by { |q| q["id"] }
  end

  shared_examples "locked out" do
    it "hides the premium answer but keeps the title" do
      questions = listed(headers)
      premium = questions[premium_question.id.to_s]

      expect(premium).to include("title" => premium_question.title, "premium" => true, "locked" => true, "answer" => nil)
      expect(response.body).not_to include("Secret answer")
      expect(questions[free_question.id.to_s]).to include("answer" => "Free answer", "locked" => false)
    end
  end

  context "when anonymous" do
    let(:headers) { {} }

    it_behaves_like "locked out"
  end

  context "when signed in without premium" do
    let(:headers) { auth_headers_for(create(:user)) }

    it_behaves_like "locked out"
  end

  context "when premium has expired" do
    let(:headers) { auth_headers_for(create(:user, premium_until: 1.day.ago)) }

    it_behaves_like "locked out"
  end

  it "shows premium answers to active premium users" do
    questions = listed(auth_headers_for(create(:user, premium_until: 1.month.from_now)))

    expect(questions[premium_question.id.to_s]).to include("answer" => "Secret answer", "locked" => false)
  end

  it "shows premium answers to admins" do
    questions = listed(auth_headers_for(create(:user, :admin)))

    expect(questions[premium_question.id.to_s]).to include("answer" => "Secret answer", "locked" => false)
  end

  it "does not leak premium answers through bookmarks" do
    user = create(:user)
    create(:bookmark, user: user, question: premium_question)

    get "/api/v1/bookmarks", headers: auth_headers_for(user)

    question = json["courses"].first["topics"].first["questions"].first
    expect(question).to include("locked" => true, "answer" => nil)
    expect(response.body).not_to include("Secret answer")
  end

  describe "admin management" do
    let(:admin_headers) { auth_headers_for(create(:user, :admin)) }

    it "creates and toggles premium questions" do
      post "/api/v1/admin/questions",
           params: { topic_id: topic.id.to_s, title: "New", level: "low", answer: "A", premium: true },
           headers: admin_headers, as: :json
      expect(json["premium"]).to be(true)

      patch "/api/v1/admin/questions/#{json['id']}",
            params: { title: "New", level: "low", answer: "A", premium: false },
            headers: admin_headers, as: :json
      expect(json["premium"]).to be(false)
    end

    it "keeps the premium flag when an update omits it" do
      patch "/api/v1/admin/questions/#{premium_question.id}",
            params: { title: "Renamed", level: "low", answer: "A" },
            headers: admin_headers, as: :json

      expect(premium_question.reload).to be_premium
    end

    it "sets and clears a user's premium_until" do
      user = create(:user)

      patch "/api/v1/admin/users/#{user.id}", params: { premium_until: "2030-01-31" }, headers: admin_headers, as: :json
      expect(json["premium_until"]).to start_with("2030-01-31")
      expect(user.reload).to be_premium

      patch "/api/v1/admin/users/#{user.id}", params: { premium_until: nil }, headers: admin_headers, as: :json
      expect(json["premium_until"]).to be_nil
      expect(user.reload).not_to be_premium
    end

    it "does not let users set premium_until on themselves at sign-up" do
      post "/api/v1/users",
           params: { user: { first_name: "A", last_name: "B", email: "self@example.com",
                             password: "Password1!", premium_until: "2030-01-01" } },
           as: :json

      expect(User.find_by(email: "self@example.com").premium_until).to be_nil
    end
  end
end
