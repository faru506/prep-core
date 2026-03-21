class InterviewTopicSerializer
  include JSONAPI::Serializer

  attributes :name, :slug, :description,
             :icon, :color, :order

  attribute :question_count do |topic|
    topic.interview_questions.published.count
  end
end