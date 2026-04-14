import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCoursesApi } from "../apis/courses";
import { fetchTopicsApi } from "../apis/topics";
import { fetchQuestionsApi } from "../apis/questions";
import {
  LEVEL_OPTIONS,
  getLevelDotClasses
} from "../utilities/levels";

import Prism from "prismjs";

import "prismjs/components/prism-ruby";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

const InterviewQA = () => {

  const { courseSlug, topicSlug } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("low");

  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const questionRefs = useRef({});
  const topicsRequestRef = useRef(0);
  const questionsRequestRef = useRef(0);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {

    if (courseSlug) {
      setSelectedLevel("low");
      setTopics([]);
      setQuestions([]);
      setSelectedTopic(null);
      loadTopics(courseSlug);
    }

  }, [courseSlug]);

  useEffect(() => {

    if (!courseSlug && courses.length > 0) {

      const firstCourse = courses[0];

      setSelectedCourse(firstCourse);

      navigate(
        `/interview_qa/${firstCourse.slug}`,
        { replace: true }
      );

    }

  }, [courseSlug, courses, navigate]);

  useEffect(() => {

    if (topicSlug && topics.length > 0) {

      const topic =
        topics.find(t => t.slug === topicSlug);

      if (topic) {
        setSelectedTopic(topic);
        setSelectedLevel("low");
        loadQuestions(topic.id);
      }

    }

  }, [topicSlug, topics]);

  useEffect(() => {

    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            const visibleId =
              entry.target.getAttribute("data-id");

            const topic =
              topics.find(
                t => t.id === visibleId
              );

            if (topic) {
              setSelectedTopic(topic);
            }

          }

        });

      },

      {
        root: null,
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0.1

      }

    );

    Object.values(questionRefs.current)
      .forEach(el => {

        if (el) observer.observe(el);

      });

    return () => {

      Object.values(questionRefs.current)
        .forEach(el => {

          if (el) observer.unobserve(el);

        });

    };

  }, [questions, topics]);

  useEffect(() => {

    Prism.highlightAll();

  }, [questions]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const loadCourses = async () => {

    try {

      const response = await fetchCoursesApi();
      const data = await response.json();

      setCourses(data);

      if (data.length > 0) {

        const selected =
          courseSlug
            ? data.find(c => c.slug === courseSlug) || data[0]
            : data[0];

        setSelectedCourse(selected);

      }

    } catch (error) {

      console.error("Failed to load courses:", error);

    }

  };

  const loadTopics = async (slug) => {

    if (!slug) return;

    const requestId = ++topicsRequestRef.current;

    try {

      setLoadingTopics(true);

      const response = await fetchTopicsApi(slug);

      const data = await response.json();

      if (requestId !== topicsRequestRef.current) {
        return;
      }

      if (!response.ok) {

        setTopics([]);
        setQuestions([]);
        setSelectedTopic(null);
        return;

      }

      setTopics(data);

      if (data.length > 0) {

        const selected = data.find(t => t.slug === topicSlug) || data[0];

        setSelectedTopic(selected);

        if (!topicSlug || !data.find(t => t.slug === topicSlug)) {
          navigate(
            `/interview_qa/${slug}/${selected.slug}`,
            { replace: true }
          );
        }

        loadQuestions(selected.id);

      } else {

        setSelectedTopic(null);
        setQuestions([]);

      }

    } catch (error) {

      if (requestId === topicsRequestRef.current) {
        console.error("Failed to load topics:", error);
      }

    } finally {

      if (requestId === topicsRequestRef.current) {
        setLoadingTopics(false);
      }

    }

  };

  const loadQuestions = async (topicId) => {

    if (!topicId) return;

    const requestId = ++questionsRequestRef.current;

    try {

      setLoadingQuestions(true);

      const response = await fetchQuestionsApi(topicId);

      const data = await response.json();

      if (requestId !== questionsRequestRef.current) {
        return;
      }

      if (!response.ok) {

        setQuestions([]);
        return;

      }

      setQuestions(data);

    } catch (error) {

      if (requestId === questionsRequestRef.current) {
        console.error("Failed to load questions:", error);
      }

    } finally {

      if (requestId === questionsRequestRef.current) {
        setLoadingQuestions(false);
      }

    }

  };

  const filteredQuestions =
    questions.filter(
      (question) =>
        (question.level || "medium") === selectedLevel
    );

  return (

    <div className="h-screen flex flex-col bg-slate-950 text-white">

      <div className="sticky bg-slate-950 z-40 px-4 md:px-6 py-3 border-b border-slate-800">

        <div className="flex gap-3 md:gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">

          {courses.map(course => (

            <button
              key={course.slug}
              onClick={() => {

                setSelectedCourse(course);
                setSelectedLevel("low");

                navigate(
                  `/interview_qa/${course.slug}`
                );

              }}
              className={`rounded-lg border border-transparent px-3 md:px-4 py-2 text-sm md:text-base outline-none transition duration-200 focus:outline-none focus-visible:border-indigo-300/40
                ${selectedCourse?.slug === course.slug
                  ? "bg-indigo-600"
                  : "bg-slate-800 hover:bg-slate-700"}
              `}
            >

              {course.title}

            </button>

          ))}

        </div>

      </div>

      <div className="flex flex-1 overflow-hidden relative">

        <div className={`
          md:relative md:w-64 md:bg-slate-900 md:border-r md:border-slate-800 md:p-4 
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>

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

              <div className="text-slate-400">
                Loading topics...
              </div>

            ) : topics.length === 0 ? (

              <div className="text-slate-400">
                No topics found
              </div>

            ) : (

              topics.map(topic => (

                <button
                  key={topic.slug}
                  onClick={() => {

                    setSelectedTopic(topic);
                    setSelectedLevel("low");

                    navigate(
                      `/interview_qa/${selectedCourse.slug}/${topic.slug}`
                    );

                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }

                  }}
                  className={`text-left px-4 py-2 rounded-lg
                    transition duration-200 hover:bg-slate-800
                    ${
                      selectedTopic?.slug === topic.slug
                        ? "bg-slate-800"
                        : ""
                    }
                  `}
                >

                  <span className="flex min-w-0 items-center gap-2">
                    <span className={`inline-flex h-2 w-2 shrink-0 rounded-full ${getLevelDotClasses(topic.level)}`} />
                    <span className="truncate">
                      {topic.title}
                    </span>
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

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {selectedTopic && questions.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">

              <div>
                <h1 className="text-lg md:text-xl font-semibold text-slate-100">
                  {selectedTopic.title}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Showing only {selectedLevel} level questions.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Level
                </span>

                <select
                  value={selectedLevel}
                  onChange={(e) =>
                    setSelectedLevel(e.target.value)
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 md:px-4 py-2 text-sm font-medium text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {LEVEL_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

              </div>

            </div>
          )}

          {loadingQuestions ? (

            <div className="text-slate-400">
              Loading questions...
            </div>

          ) : !selectedTopic || questions.length === 0 ? (

            <div className="text-slate-400">
              No questions found
            </div>

          ) : filteredQuestions.length === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-8 text-center text-slate-400">
              No {selectedLevel} level questions found for this topic.
            </div>

          ) : (

            filteredQuestions.map((q, index) => (

              <div
                key={q.id}
                data-id={q.topic_id}
                ref={(el) => (questionRefs.current[q.id] = el)}
                className="mb-4 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_18px_40px_rgba(2,6,23,0.28)]"
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/90 bg-slate-900/80 px-4 md:px-6 py-3 md:py-4">

                  <div className="flex min-w-0 items-center gap-3 md:gap-4">

                    <span className="flex h-8 md:h-9 w-8 md:w-9 shrink-0 items-center justify-center rounded-lg md:rounded-xl border border-slate-700 bg-slate-950 text-sm font-semibold text-slate-200">
                      {index + 1}
                    </span>

                    <h2 className="truncate text-base md:text-xl font-semibold text-slate-50">
                      {q.title}
                    </h2>

                  </div>

                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 whitespace-nowrap">
                    Question
                  </span>

                </div>

                <div
                  className="prose prose-invert max-w-none px-4 md:px-6 py-4 md:py-5"
                  dangerouslySetInnerHTML={{
                    __html: q.answer
                  }}
                />

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

};

export default InterviewQA;