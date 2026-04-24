import React from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArrowUp, Bookmark } from "lucide-react";
import { getQuestionNumberBgClasses } from "../utilities/levels";

const QuestionCard = React.memo(({
  question,
  index,
  numberOffset,
  pendingInteractions,
  onUpvoteToggle,
  onBookmarkToggle,
  getQuestionRef,
  getQuestionDataId,
  renderQuestionContext
}) => (
  <div key={question.id} className="mb-8 group">
      <div
        data-id={getQuestionDataId ? getQuestionDataId(question) : undefined}
        ref={getQuestionRef ? (element) => getQuestionRef(question, element) : undefined}
        className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 transition-colors duration-200 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-xl"
      >
        {/* Question Header */}
        <div className="flex items-center gap-4 p-5 md:p-7">
          <div className={`flex-shrink-0 w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-sm font-bold transition-colors duration-300 shadow-inner ${getQuestionNumberBgClasses(question.level)}`}>
            {numberOffset + index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {renderQuestionContext?.(question)}
            <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-tight transition-colors duration-300 group-hover:text-white">
              {question.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <button
               onClick={() => onUpvoteToggle(question)}
               disabled={pendingInteractions.has(`upvote:${question.id}`)}
               className={`group/btn relative p-2.5 rounded-xl transition-colors duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                 question.upvoted_by_current_user
                   ? "text-indigo-400 bg-indigo-500/10 ring-1 ring-indigo-500/20"
                   : "text-slate-500 bg-slate-800/50 hover:text-indigo-300 hover:bg-indigo-800 ring-1 ring-white/5"
               }`}
               title={
                 question.upvoted_by_current_user
                   ? "Remove Upvote"
                   : "Upvote Question"
               }
             >
               <ArrowUp
                 className={`w-5 h-5 transition-colors duration-150 ${
                   question.upvoted_by_current_user ? "fill-current scale-110" : "fill-none stroke-current"
                 }`}
               />
              {question.upvote_count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full bg-slate-950 border border-slate-800 px-1 flex items-center justify-center text-[10px] font-bold text-indigo-400 shadow-lg">
                  {question.upvote_count}
                </span>
              )}
            </button>

            <button
              onClick={() => onBookmarkToggle(question)}
              disabled={pendingInteractions.has(`bookmark:${question.id}`)}
               className={`p-2.5 rounded-xl transition-colors duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                question.bookmarked_by_current_user
                  ? "text-indigo-400 bg-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "text-slate-500 bg-slate-800/50 hover:text-indigo-300 hover:bg-indigo-800 ring-1 ring-white/5"
              }`}
              title={question.bookmarked_by_current_user ? "Remove Bookmark" : "Bookmark"}
            >
              <Bookmark
                 className={`w-5 h-5 transition-colors duration-150 ${
                  question.bookmarked_by_current_user ? "fill-current scale-110" : "fill-none stroke-current"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Answer Section */}
        <div className="relative mt-2 mb-[-2px]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 opacity-50" />
          <div className="bg-slate-950/40 px-5 py-6 md:px-7 md:py-8 rounded-r-3xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400 uppercase tracking-tighter">
                Ans
              </div>

                <div className="flex-1 relative pl-1">
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeRaw]}
                    >
                      {question.answer || ""}
                    </ReactMarkdown>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

QuestionCard.displayName = 'QuestionCard';

const QuestionCards = ({
  questions,
  pendingInteractions,
  onUpvoteToggle,
  onBookmarkToggle,
  numberOffset = 0,
  getQuestionRef,
  getQuestionDataId,
  renderQuestionContext
}) => (
  <>
    {questions.map((question, index) => (
      <QuestionCard
        key={question.id}
        question={question}
        index={index}
        numberOffset={numberOffset}
        pendingInteractions={pendingInteractions}
        onUpvoteToggle={onUpvoteToggle}
        onBookmarkToggle={onBookmarkToggle}
        getQuestionRef={getQuestionRef}
        getQuestionDataId={getQuestionDataId}
        renderQuestionContext={renderQuestionContext}
      />
    ))}
  </>
);

export default React.memo(QuestionCards);

