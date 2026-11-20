FactoryBot.define do
  factory :user do
    first_name { "Test" }
    last_name { "User" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "Password1!" }

    trait :admin do
      role { "admin" }
    end
  end

  factory :course do
    sequence(:title) { |n| "Course #{n}" }
    sequence(:slug) { |n| "course-#{n}" }
    sequence(:position)
  end

  factory :topic do
    course
    sequence(:title) { |n| "Topic #{n}" }
    sequence(:slug) { |n| "topic-#{n}" }
    sequence(:position)
  end

  factory :question do
    topic
    sequence(:title) { |n| "Question #{n}" }
    sequence(:position)
    answer { Answer.new(content: "An answer") }
  end

  factory :bookmark do
    user
    question
    topic { question.topic }
    course { question.topic.course }
  end

  factory :upvote do
    user
    question
  end
end
