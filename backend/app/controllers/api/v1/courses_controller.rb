class Api::V1::CoursesController < ApplicationController
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
end
