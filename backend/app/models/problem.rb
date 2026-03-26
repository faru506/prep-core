class Problem
  include Mongoid::Document
  include Mongoid::Timestamps

  # Fields
  field :title,             type: String
  field :slug,              type: String
  field :description,       type: String    # Markdown
  field :difficulty,        type: String    # easy | medium | hard
  field :category,          type: String    # arrays, dp, graphs, trees, etc.
  field :tags,              type: Array,    default: []
  field :target_roles,      type: Array,    default: [ "sde1", "sde2" ]
  field :constraints,       type: String
  field :examples,          type: Array,    default: []  # [{input, output, explanation}]
  field :hints,             type: Array,    default: []  # premium only
  field :solution_approach, type: String    # Markdown — premium only
  field :time_complexity,   type: String
  field :space_complexity,  type: String
  field :companies,         type: Array,    default: []
  field :frequency,         type: Integer,  default: 0   # interview frequency 1-100
  field :order,             type: Integer,  default: 0   # display order in list
  field :is_published,      type: Boolean,  default: false
  field :acceptance_rate,   type: Float,    default: 0.0
  field :total_attempts,    type: Integer,  default: 0
  field :total_accepted,    type: Integer,  default: 0
  field :source_file,       type: String    # tracks which .rb file this came from

  # Starter code templates per language
  field :starter_code, type: Hash, default: {
    "ruby"       => "def solution(input)\n  # your code here\nend",
    "python"     => "def solution(input):\n    # your code here\n    pass",
    "javascript" => "function solution(input) {\n  // your code here\n}",
    "java"       => "class Solution {\n  public int[] solution(int[] input) {\n    // your code here\n    return new int[]{};\n  }\n}",
    "cpp"        => "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> solution(vector<int>& input) {\n        // your code here\n        return {};\n    }\n};"
  }

  # Associations
  has_many :submissions, dependent: :destroy
  has_many :bookmarks,   dependent: :destroy

  # Indexes
  index({ slug: 1 },        unique: true)
  index({ difficulty: 1 })
  index({ category: 1 })
  index({ tags: 1 })
  index({ target_roles: 1 })
  index({ is_published: 1 })
  index({ frequency: -1 })
  index({ order: 1 })

  # Validations
  validates :title,      presence: true, uniqueness: true
  validates :slug,       presence: true, uniqueness: true,
                         format: { with: /\A[a-z0-9-]+\z/,
                                   message: "only lowercase letters, numbers, hyphens" }
  validates :difficulty, inclusion: { in: %w[easy medium hard] }
  validates :category,   presence: true

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? && title.present? }
  after_save        :recalculate_acceptance_rate, if: :total_attempts_previously_changed?

  # Scopes
  scope :published,     -> { where(is_published: true) }
  scope :for_role,      ->(role) { where(:target_roles.in => [ role ]) }
  scope :by_category,   ->(cat)  { where(category: cat) }
  scope :by_difficulty, ->(diff) { where(difficulty: diff) }
  scope :frequent,      -> { order(frequency: :desc) }

  def premium_content?
    hints.any? || solution_approach.present?
  end

  private

  def generate_slug
    self.slug = title.downcase
                     .gsub(/[^a-z0-9\s-]/, "")
                     .strip
                     .gsub(/\s+/, "-")
  end

  def recalculate_acceptance_rate
    return if total_attempts.zero?
    set(acceptance_rate: (total_accepted.to_f / total_attempts * 100).round(1))
  end
end
