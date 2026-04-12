class Topic
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :slug, type: String
  field :position, type: Integer
  field :level, type: String, default: "medium"

  LEVELS = %w[low medium hard].freeze

  belongs_to :course
  has_many :questions, dependent: :destroy

  validates :title, presence: true
  validates :slug, presence: true
  validates :course, presence: true
  validates :level, inclusion: { in: LEVELS }

  index({ course_id: 1 })
  index({ slug: 1 })
  index({ position: 1 })
  index({ level: 1 })
end
