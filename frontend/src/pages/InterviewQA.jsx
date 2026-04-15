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
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);


  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("low");

  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [likedQuestions, setLikedQuestions] = useState(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [facedQuestions, setFacedQuestions] = useState(new Set());
 
  const toggleLike = (id) => {
    setLikedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id) => {
    setBookmarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFaced = (id) => {
    setFacedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
 
  const questionRefs = useRef({});
  const topicsRequestRef = useRef(0);
  const questionsRequestRef = useRef(0);

  const loadQuestions = async (topicId, level, page = 1) => {
    if (!topicId) return;
    const requestId = ++questionsRequestRef.current;
    try {
      setLoadingQuestions(true);
      const response = await fetchQuestionsApi(topicId, level, page);
      const data = await response.json();
      if (requestId !== questionsRequestRef.current) return;
      if (!response.ok) {
        setQuestions([]);
        setPaginationMeta(null);
        return;
      }
      setQuestions(data.questions);
      setPaginationMeta(data.meta);
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

  const loadTopics = async (slug) => {
    if (!slug) return;
    const requestId = ++topicsRequestRef.current;
    try {
      setLoadingTopics(true);
      const response = await fetchTopicsApi(slug);
      const data = await response.json();
      if (requestId !== topicsRequestRef.current) return;
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
          navigate(`/interview_qa/${slug}/${selected.slug}`, { replace: true });
        }
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

  const loadCourses = async () => {
    try {
      const response = await fetchCoursesApi();
      const data = await response.json();
      setCourses(data);
      if (data.length > 0) {
        const selected = courseSlug ? data.find(c => c.slug === courseSlug) || data[0] : data[0];
        setSelectedCourse(selected);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
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
      setTopics([]);
      setQuestions([]);
      setSelectedTopic(null);
      loadTopicsRef.current(courseSlug);
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
        setCurrentPage(1);
      }
 
    }
 
  }, [topicSlug, topics]);

  useEffect(() => {
    if (selectedTopic) {
      loadQuestions(selectedTopic.id, selectedLevel, currentPage);
    }
  }, [selectedTopic, selectedLevel, currentPage]);


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

    const currentRefs = questionRefs.current;
    
    Object.values(currentRefs)
      .forEach(el => {

        if (el) observer.observe(el);

      });

    return () => {

      Object.values(currentRefs)
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

  return (


    <div className="h-screen flex flex-col bg-slate-950 text-white">

      <div className="sticky bg-slate-950 z-[60] px-4 md:px-6 py-3 border-b border-slate-800">

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
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm md:text-base font-medium outline-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
                ${selectedCourse?.slug === course.slug
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"}
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
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setCurrentPage(1);
                  }}
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

           ) : questions.length === 0 ? (
 
             <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-8 text-center text-slate-400">
               No {selectedLevel} level questions found for this topic.
             </div>
 
           ) : (
 
            questions.map((q, index) => (
              <div
                key={q.id}
                className="mb-6 md:mb-8"
              >
                <div
                  data-id={q.topic_id}
                  ref={(el) => (questionRefs.current[q.id] = el)}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-xl transition-all duration-300 group hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-indigo-500/5"
                >
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="flex items-center justify-center p-4 md:p-6 bg-slate-900/80 border-r border-slate-800">
                        <div className="flex-shrink-0 w-8 md:w-10 h-8 md:h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-colors duration-300">
                          {(currentPage - 1) * 10 + index + 1}
                        </div>
                      </div>

                      <div className="flex-1 px-5 py-4 flex items-center justify-between bg-slate-900/60">
                        <h2 className="text-base md:text-lg font-semibold text-slate-100 group-hover:text-white transition-colors leading-snug">
                          {q.title}
                        </h2>
                      </div>

                      <div className="flex items-center justify-center p-4 md:p-6 bg-slate-900/80 border-l border-slate-800">
                        <button 
                          onClick={() => toggleLike(q.id)}
                          className={`p-2 rounded-lg transition-all duration-200 active:scale-90 ${
                            likedQuestions.has(q.id) 
                              ? "text-red-400 bg-red-500/10" 
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                          }`}
                          title="Like"
                        >
                          <svg 
                            className={`w-5 h-5 ${likedQuestions.has(q.id) ? "fill-current" : "fill-none stroke-current"}`} 
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.128-4.312 2.733-.715-1.605-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 flex">
                      <div className="flex items-center justify-center p-4 md:p-6 bg-slate-900/80 border-r border-slate-800">
                        <button 
                          onClick={() => toggleBookmark(q.id)}
                          className={`p-2 rounded-lg transition-all duration-200 active:scale-90 ${
                            bookmarkedQuestions.has(q.id) 
                              ? "text-red-400 bg-red-500/10" 
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                          }`}
                          title="Bookmark"
                        >
                          <svg 
                            className={`w-5 h-5 ${bookmarkedQuestions.has(q.id) ? "fill-current" : "fill-none stroke-current"}`} 
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14v11l-7 4-7-4V5z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex-1 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/30 group-hover:bg-indigo-500 transition-colors duration-300" />
                        <div
                          className="px-6 py-5 prose prose-invert max-w-none text-slate-300 pl-8"
                          dangerouslySetInnerHTML={{
                            __html: q.answer
                          }}
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-slate-900/80 border-l border-slate-800">
                        <button 
                          onClick={() => toggleFaced(q.id)}
                          className={`group relative p-2 rounded-lg transition-all duration-200 active:scale-90 ${
                            facedQuestions.has(q.id) 
                              ? "text-indigo-400 bg-indigo-500/10" 
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                          }`}
                          title="Did you face this question in an interview?"
                        >
                          <svg 
                            className={`w-6 h-6 ${facedQuestions.has(q.id) ? "fill-current" : "fill-none stroke-current"}`} 
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span className="absolute hidden group-hover:block right-full mr-2 px-2 py-1 bg-slate-800 text-slate-200 text-[10px] rounded whitespace-nowrap z-10">
                            Faced in interview?
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
           )}
 
           {paginationMeta && paginationMeta.total_pages > 1 && (
             <div className="mt-8 mb-12 flex items-center justify-center gap-4">
               <button
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium text-sm
                   ${currentPage === 1 
                     ? "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed" 
                     : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"}
                 `}
               >
                 Previous
               </button>
               
               <span className="text-sm font-medium text-slate-400">
                 Page {currentPage} of {paginationMeta.total_pages}
               </span>
               
               <button
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationMeta.total_pages))}
                 disabled={currentPage === paginationMeta.total_pages}
                 className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium text-sm
                   ${currentPage === paginationMeta.total_pages 
                     ? "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed" 
                     : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"}
                 `}
               >
                 Next
               </button>
             </div>
           )}
         </div>


      </div>

    </div>

  );

};

export default InterviewQA;