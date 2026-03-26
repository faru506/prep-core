class InterviewQuestionSerializer
  include JSONAPI::Serializer

  attributes :question, :level, :tags,
             :target_roles, :is_premium,
             :view_count, :helpful_count, :order

  attribute :answer do |q, params|
    params[:premium] || !q.is_premium? ? q.answer : nil
  end

  attribute :topic_slug do |q|
    q.interview_topic&.slug
  end
end
