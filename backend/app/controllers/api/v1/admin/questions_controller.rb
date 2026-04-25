class Api::V1::Admin::QuestionsController < Api::V1::Admin::AdminController
  skip_before_action :authenticate_user!, only: [ :index ]
  skip_before_action :authorize_admin!, only: [ :index ]

  def create
    topic = Topic.find_by(id: params[:topic_id])
    return render json: { error: "Topic not found" }, status: :not_found unless topic

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
    question = Question.find_by(id: params[:id])
    return render json: { error: "Question not found" }, status: :not_found unless question

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
    question = Question.find_by(id: params[:id])
    return render json: { error: "Question not found" }, status: :not_found unless question

    topic_id = question.topic_id
    destroyed_position = question.position

    question.destroy!

    Question.where(topic_id: topic_id, :position.gt => destroyed_position)
      .update_all("$inc" => { position: -1 })

    head :no_content
  end

  def index
    topic = Topic.find_by(id: params[:topic_id])
    return render json: { error: "Topic not found" }, status: :not_found unless topic

    questions = topic.questions


    if params[:level].present? && Question::LEVELS.include?(params[:level].to_s)
      questions = questions.where(level: params[:level].to_s)
    end

    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 100).to_i
    offset = (page - 1) * per_page

    total_count = questions.count
    paginated_questions =
      questions
        .order_by(*sort_order)
        .skip(offset)
        .limit(per_page)

    question_ids = paginated_questions.map(&:_id)
    bookmarked_ids = []
    upvoted_ids = []

    if current_user
      bookmarked_ids =
        current_user.bookmarks.where(
          :question_id.in => question_ids
        ).pluck(:question_id).map(&:to_s)

      upvoted_ids =
        current_user.upvotes.where(
          :question_id.in => question_ids
        ).pluck(:question_id).map(&:to_s)
    end

    render json: {
      questions: paginated_questions.map { |q|
        {
          id: q.id.to_s,
          title: q.title,
          answer: q.answer&.content,
          level: q.level,
          topic_id: q.topic_id.to_s,
          upvote_count: q.upvote_count.to_i,
          bookmarked_by_current_user: bookmarked_ids.include?(q.id.to_s),
          upvoted_by_current_user: upvoted_ids.include?(q.id.to_s)
        }
      },
      meta: {
        current_page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil,
        total_count: total_count
      }
    }
  end

  private

  def sort_order
    return { upvote_count: :desc, position: :asc } if params[:sort].to_s == "upvotes"

    { position: :asc }
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
