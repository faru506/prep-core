class Api::V1::UpvotesController < Api::V1::BaseController
  def create
    question = Question.find(params[:question_id])

    upvote =
      current_user.upvotes.where(
        question: question
      ).first

    unless upvote
      current_user.upvotes.create!(question: question)
      question.inc(upvote_count: 1)
      question.reload
    end

    render json: {
      upvoted_by_current_user: true,
      upvote_count: question.upvote_count.to_i,
      question_id: question.id.to_s
    }, status: :created
  end

  def destroy
    question = Question.find(params[:question_id])

    upvote =
      current_user.upvotes.where(
        question: question
      ).first

    if upvote
      upvote.destroy!

      if question.upvote_count.to_i.positive?
        question.inc(upvote_count: -1)
      else
        question.set(upvote_count: 0)
      end

      question.reload
    end

    render json: {
      upvoted_by_current_user: false,
      upvote_count: question.upvote_count.to_i,
      question_id: question.id.to_s
    }
  end
end
