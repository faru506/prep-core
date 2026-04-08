class Api::V1::Admin::UsersController < Api::V1::BaseController

  def index
    users = User.all
    render json: users
  end
  
end