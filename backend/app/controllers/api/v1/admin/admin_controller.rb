class Api::V1::Admin::AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!
end
