class Api::V1::Admin::TopicsController < ApplicationController

  def create

    course = Course.find(params[:course_id])

    topic =
      course.topics.create!(
        title: params[:title],
        slug: params[:slug],
        level: params[:level],
        position: course.topics.count + 1
      )

    render json: {
      id: topic.id.to_s,
      title: topic.title,
      slug: topic.slug,
      level: topic.level
    }

  end

  def update
    topic = Topic.find(params[:id])

    topic.update!(
      title: params[:title],
      slug: params[:slug],
      level: params[:level]
    )

    render json: {
      id: topic.id.to_s,
      title: topic.title,
      slug: topic.slug,
      level: topic.level
    }
  end

  def destroy
    topic = Topic.find(params[:id])

    course_id = topic.course_id
    destroyed_position = topic.position

    topic.destroy!

    Topic.where(course_id: course_id, :position.gt => destroyed_position)
      .each do |remaining_topic|
        remaining_topic.inc(position: -1)
      end

    head :no_content
  end

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

  def reorder
    params[:topic_ids].each_with_index do |id, index|
      Topic.find(id).update(position: index + 1)
    end

    head :ok
  end

end
