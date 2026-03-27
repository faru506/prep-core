class Api::V1::ChallengesController < ApplicationController
  before_action :authenticate_user!, only: %i[create update destroy]
  before_action :authorize_admin!, only: %i[create update destroy]
  before_action :get_challenge, only: %i[show update destroy]

  def index
    @challenges = Challenge.all
    render json: @challenges, status: :ok
  end

  def create
    challenge = current_user.challenges.new(challenge_params)
    if challenge.save
      render json: { message: "Challenge created successfully...", data: challenge }, status: :created
    else
      render json: { message: "Failed...", data: challenge.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: { message: "Challenge Found successfully...", data: @challenge }, status: :ok
  end

  def update
    if @challenge.update(challenge_params)
      render json: { message: "Challenge updated successfully...", data: @challenge }, status: :ok
    else
      render json: { message: "Update Failed", data: @challenge.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @challenge.destroy
      render json: { message: "Challenge deleted successfully..." }, status: :ok
    else
      render json: { message: "Destroy Failed", data: @challenge.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def challenge_params
    params.require(:challenge).permit(:title, :description, :start_date, :end_date)
  end

  def get_challenge
    @challenge = Challenge.find_by(id: params[:id])

    unless @challenge.present?
    render json: { message: "Challenge not found..." }, status: :not_found
      nil
  end

  def authorize_admin!
    return if current_user.email == ENV['ADMIN_EMAIL']
    render json: { message: "Unauthorized Access" }, status: :forbidden
  end
end
