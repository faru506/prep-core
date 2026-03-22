module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json

      private

      def respond_with(resource, _opts = {})
        render json: {
          message: "Login successful",
          user: resource
        }, status: :ok
      end

      def respond_to_on_destroy
        render json: {
          message: "Logout successful"
        }, status: :ok
      end
    end
  end
end