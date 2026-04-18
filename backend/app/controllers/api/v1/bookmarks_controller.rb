class Api::V1::BookmarksController < Api::V1::BaseController
  def create
    question = Question.find(params[:question_id])
    topic = question.topic
    course = topic.course

    bookmark =
      current_user.bookmarks.find_or_create_by!(
        question: question
      ) do |record|
        record.topic = topic
        record.course = course
      end

    render json: {
      bookmarked_by_current_user: true,
      bookmark_id: bookmark.id.to_s,
      question_id: question.id.to_s
    }, status: :created
  end

  def destroy
    bookmark =
      current_user.bookmarks.where(
        question_id: params[:question_id]
      ).first

    bookmark&.destroy!

    render json: {
      bookmarked_by_current_user: false,
      question_id: params[:question_id].to_s
    }
  end
end
