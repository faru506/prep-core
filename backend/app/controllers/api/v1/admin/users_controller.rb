class Api::V1::Admin::UsersController < Api::V1::Admin::AdminController
  def index
    users = User.order_by(created_at: :desc)

    render json: users.map { |user| user_payload(user) }
  end

  def create
    user = User.create!(create_params)

    render json: user_payload(user), status: :created
  end

  def update
    user = User.find(params[:id])

    user.update!(update_params)

    render json: user_payload(user)
  end

  def destroy
    user = User.find(params[:id])

    user.destroy!

    head :no_content
  end

  private

  def create_params
    params.permit(
      :first_name,
      :last_name,
      :email,
      :role,
      :password
    )
  end

  def update_params
    permitted =
      params.permit(
        :first_name,
        :last_name,
        :email,
        :role,
        :password
      )

    permitted.delete(:password) if permitted[:password].blank?
    permitted
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
