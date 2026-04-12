class Api::V1::Admin::CoursesController < ApplicationController

  def create
    next_position =
      Course.max(:position).to_i + 1

    course = Course.create!(
      title: params[:title],
      slug: params[:slug],
      position: next_position
    )

    render json: course
  end

  def update
    course = Course.find(params[:id])

    course.update!(
      title: params[:title],
      slug: params[:slug]
    )

    render json: {
      id: course.id.to_s,
      title: course.title,
      slug: course.slug
    }
  end

  def destroy
    course = Course.find(params[:id])

    destroyed_position = course.position

    course.destroy!

    Course.where(:position.gt => destroyed_position)
      .each do |remaining_course|
        remaining_course.inc(position: -1)
      end

    head :no_content
  end

  def index
    courses =
      Course.all.to_a.sort_by do |course|
        [
          course.position.nil? ? 1 : 0,
          course.position || Float::INFINITY,
          course.created_at || Time.at(0)
        ]
      end

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
