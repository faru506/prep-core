module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      # POST /api/v1/auth/sign_up
      def create
        build_resource(sign_up_params)

        if resource.save
          render json: {
            message: "User created successfully",
            user: resource
          }, status: :created
        else
          render json: {
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def respond_with(resource, _opts = {})
        render json: resource
      end
    end
  end
end