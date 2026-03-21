class JwtDenylist
  include Mongoid::Document
  include Mongoid::Timestamps
  include Devise::JWT::RevocationStrategies::Denylist

  field :jti, type: String, default: ''
  field :exp, type: Time

  index({ jti: 1 }, unique: true)
  index({ exp: 1 }, expire_after_seconds: 0)  # MongoDB TTL index auto-cleans expired tokens
end