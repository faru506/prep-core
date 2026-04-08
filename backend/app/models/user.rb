class User
  include Mongoid::Document
  include Mongoid::Timestamps

  include Devise::JWT::RevocationStrategies::JTIMatcher

  before_save :downcase_email

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  # ── Fields ─────────────────────────

  field :first_name,         type: String, default: ""
  field :last_name,          type: String, default: ""
  field :email,              type: String, default: ""
  field :role,               type: String, default: "user"
  field :encrypted_password, type: String, default: ""

  field :jti, type: String, default: -> { SecureRandom.uuid }

  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time
  field :remember_created_at,    type: Time

  # ── Constants ───────────────────

  ROLES = %w[user admin]

  # ── Validations ───────────────────

  validates :first_name, :last_name, presence: true

  validates :role, inclusion: { in: ROLES }

  # Strong password validation
  validates :password,
            format: {
              with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}\z/,
              message: "must be at least 8 characters and include uppercase, lowercase, number and symbol"
            },
            if: :password_required?

  # ── Helpers ───────────────────

  def admin?
    role == "admin"
  end

  def user?
    role == "user"
  end

  def jwt_payload
    super.merge(
      email: email,
      role: role
    )
  end

  # ── Mongoid Primary Key ───────────────────

  def self.primary_key
    :_id
  end

  # ── Callback Methods ───────────────────
  def downcase_email
    self.email = email.downcase
  end

end