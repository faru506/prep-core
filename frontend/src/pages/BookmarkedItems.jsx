import { useEffect, useMemo, useRef, useState } from "react";
import Prism from "prismjs";

import QuestionCards from "../components/QuestionCards";
import {
  createUpvoteApi,
  deleteBookmarkApi,
  deleteUpvoteApi,
  fetchBookmarkedItemsApi
} from "../apis/content";
import { getToken } from "../utilities/storage";
import { getLevelDotClasses } from "../utilities/levels";
import {
  getQuestionFilterDescription,
  parseJsonSafely,
  QUESTION_FILTER_OPTIONS,
  sortQuestionsByUpvotes
} from "../utilities/questions";

import "prismjs/components/prism-ruby";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

const BookmarkedItems = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("low");
  const [loading, setLoading] = useState(true);
  const [interactionError, setInteractionError] = useState("");
  const [pendingInteractions, setPendingInteractions] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoggedIn = Boolean(getToken());

  const markInteractionPending = (key, isPending) => {
    setPendingInteractions((prev) => {
      const next = new Set(prev);

      if (isPending) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return next;
    });
  };

  const ensureSelection = (nextCourses) => {
    if (nextCourses.length === 0) {
      setSelectedCourseId(null);
      setSelectedTopicId(null);
      return;
    }

    const matchingCourse =
      nextCourses.find((course) => course.id === selectedCourseId) || nextCourses[0];
    const nextTopics = matchingCourse.topics || [];
    const matchingTopic =
      nextTopics.find((topic) => topic.id === selectedTopicId) || nextTopics[0] || null;

    setSelectedCourseId(matchingCourse.id);
    setSelectedTopicId(matchingTopic?.id || null);
  };

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setInteractionError("");

      const response = await fetchBookmarkedItemsApi();
      const data = await parseJsonSafely(response);

      if (response.status === 401) {
        setCourses([]);
        setInteractionError("Please sign in again to view your bookmarks.");
        return;
      }

      if (!response.ok || !data) {
        setCourses([]);
        setInteractionError("We couldn't load your bookmarked items right now.");
        return;
      }

      const nextCourses =
        (data.courses || []).map((course) => ({
          ...course,
          topics: (course.topics || []).map((topic) => ({
            ...topic,
            questions: topic.questions || []
          }))
        }));

      setCourses(nextCourses);
      ensureSelection(nextCourses);
    } catch (error) {
      setCourses([]);
      setInteractionError("We couldn't load your bookmarked items right now.");
      console.error("Failed to load bookmarked items:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarksRef = useRef(loadBookmarks);
  loadBookmarksRef.current = loadBookmarks;

  useEffect(() => {
    loadBookmarksRef.current();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Prism.highlightAll();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [courses, selectedTopicId, selectedLevel]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) || null;

  const topics = selectedCourse?.topics || [];

  const selectedTopic =
    topics.find((topic) => topic.id === selectedTopicId) || null;

  const visibleQuestions = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }

    const questions = selectedTopic.questions || [];

    if (selectedLevel === "upvote") {
      return sortQuestionsByUpvotes(questions);
    }

    return questions.filter((question) => question.level === selectedLevel);
  }, [selectedTopic, selectedLevel]);

  const updateCoursesWithQuestion = (questionId, updater) => {
    setCourses((prev) =>
      prev.map((course) => ({
          ...course,
          topics: (course.topics || []).map((topic) => ({
            ...topic,
            questions: (topic.questions || []).map((question) =>
              question.id === questionId
                ? { ...question, ...updater(question) }
                : question
            )
          }))
        }))
    );
  };

  const removeBookmarkedQuestion = (questionId) => {
    let nextCourses = [];

    setCourses((prev) => {
      nextCourses =
        prev
          .map((course) => ({
            ...course,
            topics: (course.topics || [])
              .map((topic) => ({
                ...topic,
                questions: (topic.questions || []).filter(
                  (question) => question.id !== questionId
                )
              }))
              .filter((topic) => topic.questions.length > 0)
          }))
          .filter((course) => course.topics.length > 0);

      return nextCourses;
    });

    ensureSelection(nextCourses);
  };

  const handleBookmarkToggle = async (question) => {
    if (!isLoggedIn) {
      setInteractionError("Please sign in to manage bookmarks.");
      return;
    }

    const actionKey = `bookmark:${question.id}`;

    if (pendingInteractions.has(actionKey)) {
      return;
    }

    setInteractionError("");
    markInteractionPending(actionKey, true);

    try {
      const response = await deleteBookmarkApi(question.id);

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Bookmark request failed");
      }

      removeBookmarkedQuestion(question.id);
    } catch (error) {
      if (error.message !== "Unauthorized") {
        setInteractionError("We couldn't update the bookmark right now.");
      }
      console.error("Failed to remove bookmark:", error);
    } finally {
      markInteractionPending(actionKey, false);
    }
  };

  const handleUpvoteToggle = async (question) => {
    if (!isLoggedIn) {
      setInteractionError("Please sign in to upvote questions.");
      return;
    }

    const actionKey = `upvote:${question.id}`;

    if (pendingInteractions.has(actionKey)) {
      return;
    }

    setInteractionError("");
    markInteractionPending(actionKey, true);

    const nextUpvotedState = !question.upvoted_by_current_user;
    const currentCount = question.upvote_count || 0;
    const nextCount = nextUpvotedState
      ? currentCount + 1
      : Math.max(currentCount - 1, 0);

    updateCoursesWithQuestion(question.id, () => ({
      upvoted_by_current_user: nextUpvotedState,
      upvote_count: nextCount
    }));

    try {
      const response = nextUpvotedState
        ? await createUpvoteApi(question.id)
        : await deleteUpvoteApi(question.id);
      const data = await parseJsonSafely(response);

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      if (!response.ok || !data) {
        throw new Error("Upvote request failed");
      }

      updateCoursesWithQuestion(question.id, () => ({
        upvoted_by_current_user: data.upvoted_by_current_user,
        upvote_count: data.upvote_count
      }));
    } catch (error) {
      updateCoursesWithQuestion(question.id, () => ({
        upvoted_by_current_user: question.upvoted_by_current_user,
        upvote_count: question.upvote_count
      }));
      if (error.message !== "Unauthorized") {
        setInteractionError("We couldn't update the upvote right now.");
      }
      console.error("Failed to update upvote:", error);
    } finally {
      markInteractionPending(actionKey, false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <div className="sticky bg-slate-950 z-[60] px-4 md:px-6 py-3 border-b border-slate-800">
        <div className="flex gap-3 md:gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedTopicId(course.topics?.[0]?.id || null);
                setSelectedLevel("low");
                setInteractionError("");
              }}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm md:text-base font-medium outline-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                selectedCourseId === course.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`
            md:relative md:w-64 md:bg-slate-900 md:border-r md:border-slate-800 md:p-4
            fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold text-slate-100">Topics</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="text-slate-400">Loading bookmarks...</div>
            ) : topics.length === 0 ? (
              <div className="text-slate-400">No bookmarked topics found</div>
            ) : (
              topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setSelectedLevel("low");
                    setInteractionError("");

                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition duration-200 hover:bg-slate-800 ${
                    selectedTopicId === topic.id ? "bg-slate-800" : ""
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={`inline-flex h-2 w-2 shrink-0 rounded-full ${getLevelDotClasses(topic.level)}`} />
                    <span className="truncate">{topic.title}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-6 left-6 z-30 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 optimize-scrolling">
          {selectedTopic && visibleQuestions.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {selectedCourse?.title}
                </p>
                <h1 className="mt-2 text-lg md:text-xl font-semibold text-slate-100">
                  {selectedTopic.title}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  {getQuestionFilterDescription(selectedLevel, {
                    defaultPrefix: "Showing your bookmarked",
                    upvoteMessage: "Showing your bookmarked questions sorted by highest upvotes."
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Level
                </span>

                <select
                  value={selectedLevel}
                  onChange={(event) => {
                    setSelectedLevel(event.target.value);
                    setInteractionError("");
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 md:px-4 py-2 text-sm font-medium text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {QUESTION_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {interactionError && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {interactionError}
            </div>
          )}

          {loading ? (
            <div className="text-slate-400">Loading bookmarked items...</div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-8 text-center text-slate-400">
              You haven't bookmarked any questions yet.
            </div>
          ) : !selectedTopic ? (
            <div className="text-slate-400">No bookmarked topics found</div>
          ) : visibleQuestions.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-8 text-center text-slate-400">
              No bookmarked {selectedLevel} level questions found in this topic.
            </div>
          ) : (
            <QuestionCards
              questions={visibleQuestions}
              pendingInteractions={pendingInteractions}
              onUpvoteToggle={handleUpvoteToggle}
              onBookmarkToggle={handleBookmarkToggle}
              renderQuestionContext={() => (
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {selectedCourse?.title} / {selectedTopic.title}
                </p>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkedItems;
