# frozen_string_literal: true

class Api::V1::Users::SessionsController < Devise::SessionsController
  include RackSessionFix
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json:
      { message: "Logged in sucessfully.",
        data: user_payload(resource)
      }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        message: "logged out successfully"
      }, status: :ok
    else
      render json: {
        message: "Couldn't find an active session."
      }, status: :unauthorized
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
