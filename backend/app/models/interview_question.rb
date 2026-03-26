class InterviewQuestion
  include Mongoid::Document
  include Mongoid::Timestamps

  LEVELS       = %w[beginner intermediate advanced].freeze
  TARGET_ROLES = %w[sde1 sde2].freeze

  # Fields
  field :question,      type: String
  field :answer,        type: String    # Markdown — full explanation
  field :level,         type: String,   default: "intermediate"
  field :tags,          type: Array,    default: []
  field :target_roles,  type: Array,    default: [ "sde1", "sde2" ]
  field :is_published,  type: Boolean,  default: false
  field :is_premium,    type: Boolean,  default: false
  field :order,         type: Integer,  default: 0
  field :view_count,    type: Integer,  default: 0
  field :helpful_count, type: Integer,  default: 0
  field :source_file,   type: String    # tracks which .rb file this was imported from

  # Association
  belongs_to :interview_topic

  # Indexes
  index({ interview_topic_id: 1, order: 1 })
  index({ interview_topic_id: 1, level: 1 })
  index({ is_published: 1 })
  index({ is_premium: 1 })
  index({ tags: 1 })
  index({ target_roles: 1 })

  # Validations
  validates :question, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :answer,   presence: true, length: { minimum: 10 }
  validates :level,    inclusion: { in: LEVELS }
  validate  :target_roles_valid

  # Scopes
  scope :published,    -> { where(is_published: true) }
  scope :free,         -> { where(is_premium: false) }
  scope :premium_only, -> { where(is_premium: true) }
  scope :by_level,     ->(l) { where(level: l) }
  scope :for_role,     ->(r) { where(:target_roles.in => [ r ]) }
  scope :ordered,      -> { order(order: :asc) }

  # Increment view count without triggering other callbacks
  def increment_views!
    inc(view_count: 1)
  end

  # Increment helpful count (used for a "was this helpful?" button)
  def mark_helpful!
    inc(helpful_count: 1)
  end

  # Returns a short preview of the answer (for list views, free users)
  def answer_preview(length: 200)
    return answer if answer.length <= length
    "#{answer[0...length]}…"
  end

  private

  def target_roles_valid
    invalid = target_roles - TARGET_ROLES
    errors.add(:target_roles, "contains invalid roles: #{invalid.join(', ')}") if invalid.any?
  end
end
