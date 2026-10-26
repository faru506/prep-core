# frozen_string_literal: true

class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionFix
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if request.method == "POST" && resource.persisted?
      render json:
        { message: "Signed up successfully.",
          data: user_payload(resource)
        }, status: :created
    elsif request.method == "DELETE"
      render json:
        { message: "Account deleted successfully."
        }, status: :ok
    elsif %w[PUT PATCH].include?(request.method)
      if resource.errors.empty?
        render json:
          { message: "Account updated successfully.",
            data: user_payload(resource)
          }, status: :ok
      else
        render json:
          { message: "User couldn't be updated successfully. #{resource.errors.full_messages.to_sentence}"
          }, status: :unprocessable_entity
      end
    else
      render json:
        { message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}"
        }, status: :unprocessable_entity
    end
  end

  def user_payload(user)
    {
      id: user.id.to_s,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }
  end
end
