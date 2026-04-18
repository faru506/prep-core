import DOMPurify from "dompurify";
import { ArrowUp, Bookmark } from "lucide-react";

const QuestionCards = ({
  questions,
  pendingInteractions,
  onUpvoteToggle,
  onBookmarkToggle,
  numberOffset = 0,
  getQuestionRef,
  getQuestionDataId,
  renderQuestionContext
}) =>
  questions.map((question, index) => (
    <div key={question.id} className="mb-6 md:mb-8">
      <div
        data-id={getQuestionDataId ? getQuestionDataId(question) : undefined}
        ref={getQuestionRef ? (element) => getQuestionRef(question, element) : undefined}
        className="flex flex-col"
      >
        <div className="rounded-t-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-xl">
          <div className="flex items-center gap-4 p-4 md:p-6">
            <div className="flex-shrink-0 w-8 md:w-10 h-8 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 transition-colors duration-300">
              {numberOffset + index + 1}
            </div>

            <div className="flex-1 min-w-0">
              {renderQuestionContext?.(question)}
              <h2 className="text-base md:text-lg font-semibold text-slate-100 leading-snug">
                {question.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpvoteToggle(question)}
                disabled={pendingInteractions.has(`upvote:${question.id}`)}
                className={`relative p-2 rounded-lg transition-all duration-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                  question.upvoted_by_current_user
                    ? "text-emerald-300 bg-emerald-500/10"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title={
                  question.upvoted_by_current_user
                    ? "Remove Upvote"
                    : "Upvote Question"
                }
              >
                <ArrowUp
                  className={`w-5 h-5 ${
                    question.upvoted_by_current_user ? "fill-current" : "fill-none stroke-current"
                  }`}
                />

                {question.upvote_count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 rounded-full bg-slate-950 px-1 text-center text-[10px] font-bold leading-4 text-emerald-300">
                    {question.upvote_count}
                  </span>
                )}
              </button>

              <button
                onClick={() => onBookmarkToggle(question)}
                disabled={pendingInteractions.has(`bookmark:${question.id}`)}
                className={`p-2 rounded-lg transition-all duration-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                  question.bookmarked_by_current_user
                    ? "text-amber-300 bg-amber-500/10"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title={question.bookmarked_by_current_user ? "Remove Bookmark" : "Bookmark"}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    question.bookmarked_by_current_user ? "fill-current" : "fill-none stroke-current"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-b-2xl border border-slate-800 border-t-0 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-xl">
          <div className="flex items-start gap-4 p-4 md:p-6">
            <div className="flex-shrink-0 w-8 md:w-10 h-8 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 transition-colors duration-300">
              A
            </div>

            <div className="flex-1 relative pl-1">
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.answer || "")
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

export default QuestionCards;
