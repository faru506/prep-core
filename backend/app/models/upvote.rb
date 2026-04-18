class Upvote
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  belongs_to :question

  validates :user, :question, presence: true

  index({ user_id: 1, question_id: 1 }, { unique: true })
  index({ question_id: 1 })
end
