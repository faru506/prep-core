import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import QuestionCards from "../components/QuestionCards";
import {
  createBookmarkApi,
  createUpvoteApi,
  deleteBookmarkApi,
  deleteUpvoteApi,
  fetchCoursesApi,
  fetchQuestionsApi,
  fetchTopicsApi
} from "../apis/content";
import { getToken } from "../utilities/storage";
import { getLevelDotClasses } from "../utilities/levels";
import {
  getQuestionFilterDescription,
  parseJsonSafely,
  QUESTION_FILTER_OPTIONS,
  sortQuestionsByUpvotes
} from "../utilities/questions";

const QUESTIONS_PER_PAGE = 10;

const InterviewQA = () => {
  const { courseSlug, topicSlug } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interactionError, setInteractionError] = useState("");
  const [pendingInteractions, setPendingInteractions] = useState(new Set());

  const questionRefs = useRef({});
  const topicsRequestRef = useRef(0);
  const questionsRequestRef = useRef(0);

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

  const updateQuestionInState = (questionId, updater) => {
    setQuestions((prev) => {
      const nextQuestions =
        prev.map((question) =>
          question.id === questionId
            ? { ...question, ...updater(question) }
            : question
        );

      if (selectedLevel === "upvote") {
        return sortQuestionsByUpvotes(nextQuestions);
      }

      return nextQuestions;
    });
  };

  const loadQuestions = async (topicId, level, page = 1) => {
    if (!topicId) {
      return;
    }

    const requestId = ++questionsRequestRef.current;

    try {
      setLoadingQuestions(true);
      setInteractionError("");

      const response = await fetchQuestionsApi(topicId, level, page);
      const data = await parseJsonSafely(response);

      if (requestId !== questionsRequestRef.current) {
        return;
      }

      if (!response.ok || !data) {
        setQuestions([]);
        setPaginationMeta(null);
        return;
      }

      setQuestions(data.questions || []);
      setPaginationMeta(data.meta || null);
    } catch (error) {
      if (requestId === questionsRequestRef.current) {
        setQuestions([]);
        setPaginationMeta(null);
        console.error("Failed to load questions:", error);
      }
    } finally {
      if (requestId === questionsRequestRef.current) {
        setLoadingQuestions(false);
      }
    }
  };

  const loadTopics = async (slug) => {
    if (!slug) {
      return;
    }

    const requestId = ++topicsRequestRef.current;

    try {
      setLoadingTopics(true);
      const response = await fetchTopicsApi(slug);
      const data = await parseJsonSafely(response);

      if (requestId !== topicsRequestRef.current) {
        return;
      }

      if (!response.ok || !data) {
        setTopics([]);
        setQuestions([]);
        setSelectedTopic(null);
        return;
      }

      setTopics(data);

      if (data.length > 0) {
        const nextTopic = data.find((topic) => topic.slug === topicSlug) || data[0];

        setSelectedTopic(nextTopic);

        if (!topicSlug || !data.find((topic) => topic.slug === topicSlug)) {
          navigate(`/interview_qa/${slug}/${nextTopic.slug}`, { replace: true });
        }
      } else {
        setSelectedTopic(null);
        setQuestions([]);
        setPaginationMeta(null);
      }
    } catch (error) {
      if (requestId === topicsRequestRef.current) {
        setTopics([]);
        setQuestions([]);
        setPaginationMeta(null);
        setSelectedTopic(null);
        console.error("Failed to load topics:", error);
      }
    } finally {
      if (requestId === topicsRequestRef.current) {
        setLoadingTopics(false);
      }
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetchCoursesApi();
      const data = await parseJsonSafely(response);

      if (!response.ok || !data) {
        setCourses([]);
        return;
      }

      setCourses(data);

      if (data.length > 0) {
        const nextCourse = courseSlug
          ? data.find((course) => course.slug === courseSlug) || data[0]
          : data[0];

        setSelectedCourse(nextCourse);
      }
    } catch (error) {
      setCourses([]);
      console.error("Failed to load courses:", error);
    }
  };

  const handleBookmarkToggle = async (question) => {
    if (!isLoggedIn) {
      setInteractionError("Please sign in to bookmark questions.");
      return;
    }

    const actionKey = `bookmark:${question.id}`;

    if (pendingInteractions.has(actionKey)) {
      return;
    }

    setInteractionError("");
    markInteractionPending(actionKey, true);

    const nextBookmarkedState = !question.bookmarked_by_current_user;

    updateQuestionInState(question.id, () => ({
      bookmarked_by_current_user: nextBookmarkedState
    }));

    try {
      const response = nextBookmarkedState
        ? await createBookmarkApi(question.id)
        : await deleteBookmarkApi(question.id);

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Bookmark request failed");
      }
    } catch (error) {
      updateQuestionInState(question.id, () => ({
        bookmarked_by_current_user: question.bookmarked_by_current_user
      }));
      if (error.message !== "Unauthorized") {
        setInteractionError("We couldn't update the bookmark right now.");
      }
      console.error("Failed to update bookmark:", error);
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

    updateQuestionInState(question.id, () => ({
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

      updateQuestionInState(question.id, () => ({
        upvoted_by_current_user: data.upvoted_by_current_user,
        upvote_count: data.upvote_count
      }));
    } catch (error) {
      updateQuestionInState(question.id, () => ({
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

  const loadCoursesRef = useRef(loadCourses);
  loadCoursesRef.current = loadCourses;

  useEffect(() => {
    loadCoursesRef.current();
  }, []);

  const loadTopicsRef = useRef(loadTopics);
  loadTopicsRef.current = loadTopics;

  useEffect(() => {
    if (courseSlug) {
      setSelectedLevel("low");
      setCurrentPage(1);
      setTopics([]);
      setQuestions([]);
      setPaginationMeta(null);
      setSelectedTopic(null);
      setInteractionError("");
      loadTopicsRef.current(courseSlug);
    }
  }, [courseSlug]);

  useEffect(() => {
    if (!courseSlug && courses.length > 0) {
      const firstCourse = courses[0];

      setSelectedCourse(firstCourse);
      navigate(`/interview_qa/${firstCourse.slug}`, { replace: true });
    }
  }, [courseSlug, courses, navigate]);

  useEffect(() => {
    if (topicSlug && topics.length > 0) {
      const nextTopic = topics.find((topic) => topic.slug === topicSlug);

      if (nextTopic) {
        setSelectedTopic(nextTopic);
      setSelectedLevel("");
        setCurrentPage(1);
        setInteractionError("");
      }
    }
  }, [topicSlug, topics]);

  useEffect(() => {
    if (selectedTopic) {
      loadQuestions(selectedTopic.id, selectedLevel, currentPage);
    }
  }, [selectedTopic, selectedLevel, currentPage]);

  useEffect(() => {
    let timeoutId;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          // Debounce topic switching during rapid scrolling
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            const visibleTopicId = entry.target.getAttribute("data-id");
            const nextTopic = topics.find((topic) => topic.id === visibleTopicId);

            if (nextTopic && selectedTopic?.id !== nextTopic.id) {
              setSelectedTopic(nextTopic);
            }
          }, 100);
        });
      },
      {
        root: null,
        rootMargin: "-50px 0px -50% 0px",
        threshold: 0.25
      }
    );

    const currentRefs = questionRefs.current;

    Object.values(currentRefs).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      Object.values(currentRefs).forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [questions, topics, selectedTopic?.id]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <div className="sticky bg-slate-950 z-[60] px-4 md:px-6 py-3 border-b border-slate-800">
        <div className="flex gap-3 md:gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {courses.map((course) => (
            <button
              key={course.slug}
              onClick={() => {
                setSelectedCourse(course);
        setSelectedLevel("");
                setCurrentPage(1);
                setInteractionError("");
                navigate(`/interview_qa/${course.slug}`);
              }}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm md:text-base font-medium outline-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                selectedCourse?.slug === course.slug
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
            {loadingTopics ? (
              <div className="text-slate-400">Loading topics...</div>
            ) : topics.length === 0 ? (
              <div className="text-slate-400">No topics found</div>
            ) : (
              topics.map((topic) => (
                <button
                  key={topic.slug}
                  onClick={() => {
                    setSelectedTopic(topic);
      setSelectedLevel("");
                    setCurrentPage(1);
                    setInteractionError("");
                    navigate(`/interview_qa/${selectedCourse.slug}/${topic.slug}`);

                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition duration-200 hover:bg-slate-800 ${
                    selectedTopic?.slug === topic.slug ? "bg-slate-800" : ""
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
          {selectedTopic && questions.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-slate-100">
                  {selectedTopic.title}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  {getQuestionFilterDescription(selectedLevel)}
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
                    setCurrentPage(1);
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

          {loadingQuestions ? (
            <div className="text-slate-400">Loading questions...</div>
          ) : !selectedTopic || questions.length === 0 ? (
            <div className="text-slate-400">No questions found</div>
          ) : (
            <QuestionCards
              questions={questions}
              pendingInteractions={pendingInteractions}
              onUpvoteToggle={handleUpvoteToggle}
              onBookmarkToggle={handleBookmarkToggle}
              numberOffset={(currentPage - 1) * QUESTIONS_PER_PAGE}
              getQuestionDataId={(question) => question.topic_id}
              getQuestionRef={(question, element) => {
                questionRefs.current[question.id] = element;
              }}
            />
          )}

          {paginationMeta && paginationMeta.total_pages > 1 && questions.length > 0 && (
            <div className="mt-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 md:px-6 py-4">
              <p className="text-sm text-slate-400">
                Showing{" "}
                <span className="text-white font-medium">
                  {(currentPage - 1) * paginationMeta.per_page + 1}
                </span>{" "}
                to{" "}
                <span className="text-white font-medium">
                  {Math.min(currentPage * paginationMeta.per_page, paginationMeta.total_count)}
                </span>{" "}
                of{" "}
                <span className="text-white font-medium">{paginationMeta.total_count}</span> questions
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(paginationMeta.total_pages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        currentPage === index + 1
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.total_pages))
                  }
                  disabled={currentPage === paginationMeta.total_pages}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewQA;
