module Api
  module V1
    class InterviewTopicsController < ApplicationController
      def index
        topics = InterviewTopic.all

        render json: {
          data: topics
        }
      end

      def questions
        topic =
          InterviewTopic.find_by!(
            slug: params[:slug]
          )

        render json: {
          data: topic.questions
        }
      end
    end
  end
end