class Api::V1::Admin::BaseController < ApplicationController
  before_action :authorize_admin!
end