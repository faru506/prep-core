require "rails_helper"

RSpec.describe "Public content", type: :request do
  it "lists courses in position order without signing in" do
    create(:course, title: "Second", position: 2)
    create(:course, title: "First", position: 1)

    get "/api/v1/courses"

    expect(response).to have_http_status(:ok)
    expect(json.map { |c| c["title"] }).to eq(%w[First Second])
  end

  it "lists a course's topics by id or slug without signing in" do
    course = create(:course, slug: "rails")
    create(:topic, course: course, title: "Later", position: 2)
    create(:topic, course: course, title: "Earlier", position: 1)

    [ course.id.to_s, "rails" ].each do |course_key|
      get "/api/v1/courses/#{course_key}/topics"

      expect(response).to have_http_status(:ok)
      expect(json.map { |t| t["title"] }).to eq(%w[Earlier Later])
    end
  end
end
