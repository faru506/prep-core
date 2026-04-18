class Bookmark
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  belongs_to :course
  belongs_to :topic
  belongs_to :question

  validates :user, :course, :topic, :question, presence: true

  index({ user_id: 1, question_id: 1 }, { unique: true })
  index({ user_id: 1, course_id: 1 })
  index({ user_id: 1, topic_id: 1 })
  index({ user_id: 1, created_at: -1 })
end
