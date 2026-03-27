class User
  include Mongoid::Document
  include Mongoid::Timestamps

  # Required for JTI strategy
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # ── Devise + JWT ─────────────────────────
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  # ── Devise Fields ────────────────────────
  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  field :jti, type: String, default: -> { SecureRandom.uuid }

  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time
  field :remember_created_at,    type: Time

  # ── Associations ─────────────────────────
  has_many :challenges,  dependent: :destroy

  def self.primary_key
    :_id
  end

end
