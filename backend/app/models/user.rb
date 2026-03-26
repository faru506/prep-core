class User
  include Mongoid::Document
  include Mongoid::Timestamps

  # ── Devise + JWT ─────────────────────────
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist

  # ── Devise Fields ────────────────────────
  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time
  field :remember_created_at,    type: Time

  # ── Profile Fields ───────────────────────
  # field :username,        type: String
  # field :name,            type: String
  # field :role,            type: String,   default: 'free'
  # field :avatar_url,      type: String
  # field :bio,             type: String
  # field :github_username, type: String
  # field :linkedin_url,    type: String
  # field :target_role,     type: String

  # ── Stats ────────────────────────────────
  # field :streak,          type: Integer,  default: 0
  # field :total_solved,    type: Integer,  default: 0
  # field :last_active_on,  type: Date
  # field :premium_until,   type: DateTime

  # ── Associations ─────────────────────────
  # has_many :submissions, dependent: :destroy
  # has_many :bookmarks,   dependent: :destroy

  # ── Indexes ──────────────────────────────
  # index({ email: 1 },    unique: true)
  # index({ username: 1 }, unique: true)

  # ── Validations ──────────────────────────
  # validates :username,
  #           presence: true,
  #           uniqueness: true,
  #           length: { minimum: 3, maximum: 30 }

  # validates :name,
  #           presence: true

  # validates :role,
  #           inclusion: { in: %w[free premium admin] }

  # # ── JWT Payload ──────────────────────────
  # def jwt_payload
  #   {
  #     role: role,
  #     username: username
  #   }
  # end

  # # ── Helpers ──────────────────────────────
  # def admin?
  #   role == 'admin'
  # end

  # def premium?
  #   role == 'premium' ||
  #     (premium_until.present? && premium_until > Time.current)
  # end
end
