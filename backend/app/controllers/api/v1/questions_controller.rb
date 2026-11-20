class Api::V1::QuestionsController < ApplicationController
  def index
    topic = Topic.find_by(id: params[:topic_id])
    return render json: { error: "Topic not found" }, status: :not_found unless topic

    questions = topic.questions

    if params[:level].present? && Question::LEVELS.include?(params[:level].to_s)
      questions = questions.where(level: params[:level].to_s)
    end

    page = [ (params[:page] || 1).to_i, 1 ].max
    per_page = (params[:per_page] || 10).to_i.clamp(1, 50)
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
end
