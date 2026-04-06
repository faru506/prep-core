class User
  include Mongoid::Document
  include Mongoid::Timestamps

  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  # ── Fields ─────────────────────────

  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  field :jti, type: String, default: -> { SecureRandom.uuid }

  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time
  field :remember_created_at,    type: Time

  # ── Custom Validations ───────────────────

  validates :password,
            format: {
              with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}\z/,
              message: "must be at least 8 characters and include uppercase, lowercase, number and symbol"
            },
            if: :password_required?

  # ── Associations ─────────────────────────

  def self.primary_key
    :_id
  end

end