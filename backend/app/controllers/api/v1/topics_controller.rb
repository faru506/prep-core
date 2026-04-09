class Api::V1::TopicsController < ApplicationController

  def index

    course = Course.find_by!(slug: params[:course_id])

    topics = course.topics.order_by(position: :asc)

    render json: topics.map { |topic|
      {
        id: topic.id.to_s,
        title: topic.title
      }
    }

  end

end