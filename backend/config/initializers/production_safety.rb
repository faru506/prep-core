# backend/config/initializers/production_safety.rb

if Rails.env.production?
  # Prevent accidental data loss in production by overriding destructive methods if necessary
  # Mongoid doesn't have a single "drop_all" but we can monitor for dangerous patterns
  # In a real production environment, this is best handled via MongoDB Atlas Role-Based Access Control (RBAC)
  # by ensuring the application user does not have 'dbAdmin' or 'dropDatabase' privileges.
  
  Rails.logger.info "Production safety: Database destructive operations should be restricted via MongoDB Atlas RBAC."
end
