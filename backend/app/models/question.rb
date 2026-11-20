class Question
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :position, type: Integer
  field :level, type: String, default: "medium"
  field :upvote_count, type: Integer, default: 0
  field :premium, type: Boolean, default: false

  LEVELS = %w[low medium hard].freeze

  belongs_to :topic
  has_many :bookmarks, dependent: :destroy
  has_many :upvotes, dependent: :destroy

  embeds_one :answer, cascade_callbacks: true

  validates :title, presence: true
  validates :level, inclusion: { in: LEVELS }

  index({ topic_id: 1 })
  index({ position: 1 })
  index({ level: 1 })
  index({ upvote_count: 1 })

  def locked_for?(user)
    premium? && !user&.premium?
  end

  def answer_for(user)
    answer&.content unless locked_for?(user)
  end
end
