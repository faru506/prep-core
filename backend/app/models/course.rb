class Course
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :slug, type: String
  field :position, type: Integer

  has_many :topics, dependent: :destroy

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  index({ slug: 1 }, { unique: true })
  index({ position: 1 })
end