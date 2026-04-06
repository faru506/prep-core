class Api::V1::Admin::UsersController < BaseController

  def index
    users = User.all
    render json: users
  end
  
end