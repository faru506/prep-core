class Api::V1::CoursesController < ApplicationController

  def index

    courses = Course.order_by(position: :asc)

    render json: courses.map { |course|
      {
        id: course.id.to_s,
        title: course.title,
        slug: course.slug
      }
    }

  end

end