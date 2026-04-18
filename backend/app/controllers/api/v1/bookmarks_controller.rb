class Api::V1::BookmarksController < Api::V1::BaseController
  def index
    bookmarks = current_user.bookmarks.to_a
    upvoted_ids =
      current_user.upvotes.pluck(:question_id)
        .map(&:to_s)

    courses =
      bookmarks
        .group_by(&:course)
        .sort_by do |course, _course_bookmarks|
          [
            course.position || Float::INFINITY,
            course.title.to_s.downcase
          ]
        end
        .map do |course, course_bookmarks|
          {
            id: course.id.to_s,
            title: course.title,
            slug: course.slug,
            topics: serialized_topics(course_bookmarks, upvoted_ids)
          }
        end

    render json: {
      courses: courses
    }
  end

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

  private

  def serialized_topics(bookmarks, upvoted_ids)
    bookmarks
      .group_by(&:topic)
      .sort_by do |topic, _topic_bookmarks|
        [
          topic.position || Float::INFINITY,
          topic.title.to_s.downcase
        ]
      end
      .map do |topic, topic_bookmarks|
        {
          id: topic.id.to_s,
          title: topic.title,
          slug: topic.slug,
          level: topic.level,
          questions: serialized_questions(topic_bookmarks, upvoted_ids)
        }
      end
  end

  def serialized_questions(bookmarks, upvoted_ids)
    bookmarks
      .map(&:question)
      .compact
      .uniq(&:id)
      .sort_by do |question|
        [
          question.position || Float::INFINITY,
          question.title.to_s.downcase
        ]
      end
      .map do |question|
        {
          id: question.id.to_s,
          title: question.title,
          answer: question.answer&.content,
          level: question.level,
          topic_id: question.topic_id.to_s,
          upvote_count: question.upvote_count.to_i,
          bookmarked_by_current_user: true,
          upvoted_by_current_user: upvoted_ids.include?(question.id.to_s)
        }
      end
  end
end
