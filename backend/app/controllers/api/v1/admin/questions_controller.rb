class Api::V1::Admin::QuestionsController < ApplicationController

  def create
    topic = Topic.find(params[:topic_id])
    next_position =
      topic.questions.max(:position).to_i + 1

    question = topic.questions.create!(
      title: params[:title],
      level: params[:level],
      position: next_position
    )

    question.build_answer(
      content: params[:answer]
    )

    question.save!

    render json: {
      id: question.id.to_s,
      title: question.title,
      answer: question.answer&.content,
      level: question.level
    }
  end

  def update
    question = Question.find(params[:id])

    question.update!(
      title: params[:title],
      level: params[:level]
    )

    if question.answer.present?
      question.answer.update!(content: params[:answer])
    else
      question.build_answer(content: params[:answer])
      question.save!
    end

    render json: {
      id: question.id.to_s,
      title: question.title,
      answer: question.answer&.content,
      level: question.level
    }
  end

  def destroy
    question = Question.find(params[:id])

    topic_id = question.topic_id
    destroyed_position = question.position

    question.destroy!

    Question.where(topic_id: topic_id, :position.gt => destroyed_position)
      .each do |remaining_question|
        remaining_question.inc(position: -1)
      end

    head :no_content
  end

  def index
    topic = Topic.find(params[:topic_id])
    questions = topic.questions.order_by(position: :asc)

    render json:
      questions.map { |q|
        {
          id: q.id.to_s,
          title: q.title,
          answer: q.answer&.content,
          level: q.level,
          topic_id: q.topic_id.to_s
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
