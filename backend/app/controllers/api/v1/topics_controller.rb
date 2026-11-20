class Api::V1::TopicsController < ApplicationController
  def index
    course =
      if BSON::ObjectId.legal?(params[:course_id].to_s)
        Course.find(params[:course_id])
      else
        Course.find_by!(slug: params[:course_id])
      end

    topics = course.topics.order_by(position: :asc)

    render json: topics.map { |t|
      {
        id: t.id.to_s,
        title: t.title,
        slug: t.slug,
        level: t.level
      }
    }
  end
end
