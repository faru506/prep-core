class Api::V1::Admin::QuestionsController < ApplicationController

  def create
    topic = Topic.find(params[:topic_id])

    question = topic.questions.create!(
      title: params[:title],
      position: params[:position]
    )

    question.create_answer!(
      content: params[:content]
    )

    render json: {
      id: question.id.to_s,
      title: question.title
    }
  end

end