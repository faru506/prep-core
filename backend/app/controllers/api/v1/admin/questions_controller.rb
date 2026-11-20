class Api::V1::Admin::QuestionsController < Api::V1::Admin::AdminController
  def create
    topic = Topic.find_by(id: params[:topic_id])
    return render json: { error: "Topic not found" }, status: :not_found unless topic

    next_position =
      topic.questions.max(:position).to_i + 1

    question = topic.questions.create!(
      title: params[:title],
      level: params[:level],
      premium: ActiveModel::Type::Boolean.new.cast(params[:premium]) || false,
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
      level: question.level,
      premium: question.premium?
    }
  end

  def update
    question = Question.find_by(id: params[:id])
    return render json: { error: "Question not found" }, status: :not_found unless question

    question.assign_attributes(title: params[:title], level: params[:level])
    question.premium = ActiveModel::Type::Boolean.new.cast(params[:premium]) if params.key?(:premium)
    question.save!

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
      level: question.level,
      premium: question.premium?
    }
  end

  def destroy
    question = Question.find_by(id: params[:id])
    return render json: { error: "Question not found" }, status: :not_found unless question

    topic_id = question.topic_id
    destroyed_position = question.position

    question.destroy!

    Question.where(topic_id: topic_id, :position.gt => destroyed_position)
      .update_all("$inc" => { position: -1 })

    head :no_content
  end

  # Unpaginated on purpose: the Course Manager must see every question to edit and reorder them.
  def index
    topic = Topic.find_by(id: params[:topic_id])
    return render json: { error: "Topic not found" }, status: :not_found unless topic

    questions = topic.questions.order_by(position: :asc)

    render json: {
      questions: questions.map { |q|
        {
          id: q.id.to_s,
          title: q.title,
          answer: q.answer&.content,
          level: q.level,
          premium: q.premium?,
          topic_id: q.topic_id.to_s
        }
      }
    }
  end

  def reorder
    topic = Topic.where(id: params[:topic_id]).first
    return render json: { error: "Topic not found" }, status: :not_found unless topic

    question_ids = Array(params[:question_ids])
    return render json: { error: "question_ids must be an array" }, status: :bad_request if question_ids.empty? && params.key?(:question_ids) && !params[:question_ids].is_a?(Array)
    return render json: { error: "question_ids required" }, status: :bad_request if question_ids.empty?

    questions = topic.questions
    question_ids.each_with_index do |id, index|
      question = questions.where(id: id).first
      next unless question
      question.update(position: index + 1)
    end

    head :ok
  end
end
