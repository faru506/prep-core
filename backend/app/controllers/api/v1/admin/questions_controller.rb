class Api::V1::Admin::QuestionsController < ApplicationController

  def create
    topic = Topic.find(params[:topic_id])

    question = topic.questions.create!(
      title: params[:title],
      position: topic.questions.count
    )

    question.build_answer(
      content: params[:answer]
    )

    question.save!

    render json: {
      id: question.id.to_s,
      title: question.title
    }
  end

  def index
    topic = Topic.find(params[:topic_id])
    questions = topic.questions.order_by(position: :asc)

    render json:
      questions.map { |q|
        {
          id: q.id.to_s,
          title: q.title
        }
      }

  end

  def reorder
    topic = Topic.find(params[:topic_id])
    questions = topic.questions
    params[:question_ids].each_with_index do |id, index|
      questions.find(id).update(position: index + 1)
    end

    head :ok
  end

end