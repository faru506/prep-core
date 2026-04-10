class Api::V1::Admin::CoursesController < ApplicationController

  def create
    course = Course.create!(
      title: params[:title],
      slug: params[:slug],
      position: params[:position]
    )

    render json: course
  end

  def index
    courses = Course.order_by(position: :asc)

    render json: courses.map { |c|
      {
        id: c.id.to_s,
        title: c.title,
        slug: c.slug
      }
    }
  end

  def reorder
    params[:course_ids].each_with_index do |id, index|
      Course.find(id).update(position: index + 1)
    end

    head :ok
  end

end