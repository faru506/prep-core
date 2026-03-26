class InterviewTopic
  include Mongoid::Document
  include Mongoid::Timestamps

  # Fields
  field :name,        type: String
  field :slug,        type: String
  field :description, type: String
  field :icon,        type: String   # emoji e.g. "💎"
  field :color,       type: String   # hex e.g. "#CC342D" — used for the topic card
  field :order,       type: Integer, default: 0
  field :is_active,   type: Boolean, default: true

  # Associations
  has_many :interview_questions, dependent: :destroy

  # Indexes
  index({ slug: 1 },  unique: true)
  index({ order: 1 })
  index({ is_active: 1 })

  # Validations
  validates :name,  presence: true, uniqueness: true
  validates :slug,  presence: true, uniqueness: true
  validates :color, format: { with: /\A#[0-9a-fA-F]{6}\z/,
                               message: "must be a valid hex color e.g. #CC342D" },
                    allow_blank: true

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? && name.present? }

  # Scopes
  scope :active,   -> { where(is_active: true).order(order: :asc) }
  scope :inactive, -> { where(is_active: false) }

  # Returns published question count — used in the topic card UI
  def published_question_count
    interview_questions.published.count
  end

  private

  def generate_slug
    self.slug = name.downcase
                    .gsub(/[^a-z0-9\s-]/, "")
                    .strip
                    .gsub(/\s+/, "-")
  end
end
