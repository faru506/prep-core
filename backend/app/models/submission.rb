class Submission
  include Mongoid::Document
  include Mongoid::Timestamps

  STATUSES = %w[
    pending
    accepted
    wrong_answer
    time_limit_exceeded
    memory_limit_exceeded
    runtime_error
    compile_error
  ].freeze

  LANGUAGES = %w[ruby python javascript java cpp].freeze

  # Fields
  field :language,      type: String
  field :code,          type: String
  field :status,        type: String,  default: "pending"
  field :runtime,       type: Integer  # milliseconds
  field :memory,        type: Integer  # KB
  field :error_message, type: String
  field :test_results,  type: Array,   default: []
  # test_results format:
  # [{ index: 1, status: 'accepted', input: '...', expected: '...', actual: '...', runtime: 42 }]

  # Associations
  belongs_to :user
  belongs_to :problem

  # Indexes
  index({ user_id: 1,    created_at: -1 })
  index({ problem_id: 1, status: 1 })
  index({ status: 1 })

  # Validations
  validates :language, inclusion: { in: LANGUAGES }
  validates :status,   inclusion: { in: STATUSES }
  validates :code,     presence: true, length: { maximum: 50_000 }

  # Callbacks
  after_create :enqueue_evaluation
  after_save   :update_stats, if: :status_previously_changed?

  # Scopes
  scope :accepted, -> { where(status: "accepted") }
  scope :recent,   -> { order(created_at: :desc) }
  scope :for_user, ->(user) { where(user: user) }

  def accepted?
    status == "accepted"
  end

  def pending?
    status == "pending"
  end

  private

  def enqueue_evaluation
    EvaluateSubmissionJob.perform_later(id.to_s)
  end

  def update_stats
    return unless accepted?
    problem.inc(total_accepted: 1)
    user.update_streak!
    user.inc(total_solved: 1)
  end
end
