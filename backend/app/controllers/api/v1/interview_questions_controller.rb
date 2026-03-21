module Api
  module V1
    class InterviewQuestionsController < ApplicationController
      before_action :set_topic

      def index
        questions = @topic.interview_questions.published
        questions = questions.by_level(params[:level])   if params[:level].present?
        questions = questions.for_role(params[:role])    if params[:role].present?
        questions = questions.free unless current_user&.premium?

        render json: InterviewQuestionSerializer.new(
          questions.order(order: :asc),
          params: { premium: current_user&.premium? }
        ).serializable_hash
      end

      def show
        question = @topic.interview_questions.published.find(params[:id])

        unless current_user&.premium?
          if question.is_premium?
            return render json: {
              error: 'Premium required',
              question: question.question,
              upgrade_url: '/upgrade'
            }, status: :payment_required
          end
        end

        question.inc(view_count: 1)
        render json: InterviewQuestionSerializer.new(question).serializable_hash
      rescue Mongoid::Errors::DocumentNotFound
        render json: { error: 'Question not found' }, status: :not_found
      end

      private

      def set_topic
        @topic = InterviewTopic.find_by!(slug: params[:interview_topic_slug])
      rescue Mongoid::Errors::DocumentNotFound
        render json: { error: 'Topic not found' }, status: :not_found
      end
    end
  end
end