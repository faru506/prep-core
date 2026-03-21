class User
  include Mongoid::Document
  include Mongoid::Timestamps

  # Devise modules
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist

  # Fields
  field :email,              type: String
  field :username,           type: String
  field :name,               type: String
  field :role,               type: String,   default: 'free'
  field :avatar_url,         type: String
  field :bio,                type: String
  field :github_username,    type: String
  field :linkedin_url,       type: String
  field :target_role,        type: String    # 'sde1' | 'sde2' | 'both'
  field :streak,             type: Integer,  default: 0
  field :total_solved,       type: Integer,  default: 0
  field :last_active_on,     type: Date
  field :premium_until,      type: DateTime
  field :encrypted_password, type: String

  # Associations
  has_many :submissions,         dependent: :destroy
  has_many :bookmarks,           dependent: :destroy

  # Indexes
  index({ email: 1 },    unique: true)
  index({ username: 1 }, unique: true)
  index({ role: 1 })
  index({ created_at: -1 })

  # Validations
  validates :username,
            presence: true,
            uniqueness: { case_sensitive: false },
            length: { minimum: 3, maximum: 30 },
            format: { with: /\A[a-zA-Z0-9_]+\z/,
                      message: 'only letters, numbers, and underscores' }
  validates :name,        presence: true, length: { maximum: 100 }
  validates :role,        inclusion: { in: %w[free premium admin] }
  validates :target_role, inclusion: { in: %w[sde1 sde2 both] }, allow_blank: true

  # Scopes
  scope :premium,      -> { where(role: 'premium') }
  scope :admins,       -> { where(role: 'admin') }
  scope :active_today, -> { where(last_active_on: Date.today) }

  # Instance methods
  def premium?
    role == 'premium' ||
      (premium_until.present? && premium_until > Time.current) ||
      admin?
  end

  def admin?
    role == 'admin'
  end

  # Extra claims embedded in the JWT token
  def jwt_payload
    { role: role, username: username }
  end

  def update_streak!
    today = Date.today
    if last_active_on == today - 1
      inc(streak: 1)
    elsif last_active_on != today
      set(streak: 1)
    end
    set(last_active_on: today)
  end
end