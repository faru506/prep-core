class Api::V1::QuestionsController < ApplicationController

  def index

    topic = Topic.find(params[:topic_id])

    questions = topic.questions.order_by(position: :asc)

    render json: questions.map { |q|
      {
        id: q.id.to_s,
        title: q.title,
        answer: q.answer&.content,
        topic_id: q.topic_id.to_s,
        level: q.level
      }
    }

  end

end
