require "spec_helper"
ENV["RAILS_ENV"] = "test"
ENV["JWT_SECRET"] ||= "test-jwt-secret"
require_relative "../config/environment"
require "rspec/rails"
require "devise/jwt/test_helpers"

# Every example purges the database, so refuse to run against anything that is
# not a dedicated test database (e.g. a dev URI leaking in through .env).
database_name = Mongoid.default_client.database.name
unless Rails.env.test? && database_name.end_with?("_test")
  abort("Refusing to run specs against database '#{database_name}' (RAILS_ENV=#{Rails.env}).")
end

Rails.root.glob("spec/support/**/*.rb").sort.each { |file| require file }

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
  config.include RequestHelpers, type: :request
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  config.before(:suite) { Mongoid::Tasks::Database.create_indexes }
  config.before { Mongoid.purge! }
end
