class Bookmark
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  belongs_to :problem

  index({ user_id: 1, problem_id: 1 }, unique: true)
  index({ user_id: 1, created_at: -1 })

  validates :user_id,    presence: true
  validates :problem_id, presence: true
  validate  :no_duplicate_bookmark

  private

  def no_duplicate_bookmark
    if Bookmark.where(user: user, problem: problem).where(:id.ne => id).exists?
      errors.add(:base, "Already bookmarked")
    end
  end
end
