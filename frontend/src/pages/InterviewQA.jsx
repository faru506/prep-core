import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCoursesApi } from "../apis/courses";
import { fetchTopicsApi } from "../apis/topics";
import { fetchQuestionsApi } from "../apis/questions";

const InterviewQA = () => {

  const { courseSlug, topicSlug } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Load courses initially
  useEffect(() => {
    loadCourses();
  }, []);

  // Reload topics when courseSlug changes
  useEffect(() => {

    if (courseSlug) {
      loadTopics(courseSlug);
    }

  }, [courseSlug]);

  // Reload questions when topicSlug changes
  useEffect(() => {

    if (topicSlug && topics.length > 0) {

      const topic =
        topics.find(t => t.slug === topicSlug);

      if (topic) {
        setSelectedTopic(topic);
        loadQuestions(topic.id);
      }

    }

  }, [topicSlug, topics]);

  const loadCourses = async () => {

    try {

      const response = await fetchCoursesApi();
      const data = await response.json();

      setCourses(data);

      if (data.length > 0) {

        const selected = data.find(c => c.slug === courseSlug) || data[0];

        setSelectedCourse(selected);

        navigate(
          `/interview_qa/${selected.slug}`,
          { replace: true }
        );

      }

    } catch (error) {

      console.error("Failed to load courses:", error);

    }

  };

  const loadTopics = async (slug) => {

    if (!slug) return;

    try {

      setLoadingTopics(true);

      const response = await fetchTopicsApi(slug);

      const data = await response.json();

      if (!response.ok) {

        setTopics([]);
        setQuestions([]);
        return;

      }

      setTopics(data);

      if (data.length > 0) {

        const selected = data.find(t => t.slug === topicSlug) || data[0];

        setSelectedTopic(selected);

        navigate(
          `/interview_qa/${slug}/${selected.slug}`,
          { replace: true }
        );

        loadQuestions(selected.id);

      }

    } catch (error) {

      console.error("Failed to load topics:", error);

    } finally {

      setLoadingTopics(false);

    }

  };

  const loadQuestions = async (topicId) => {

    if (!topicId) return;

    try {

      setLoadingQuestions(true);

      const response = await fetchQuestionsApi(topicId);

      const data = await response.json();

      if (!response.ok) {

        setQuestions([]);
        return;

      }

      setQuestions(data);

    } catch (error) {

      console.error("Failed to load questions:", error);

    } finally {

      setLoadingQuestions(false);

    }

  };

  return (

    <div className="h-screen flex flex-col bg-slate-950 text-white">

      <div className="sticky bg-slate-950 z-40 px-6 py-3 border-b border-slate-800">

        <div
          className="flex gap-4 overflow-x-auto
          [&::-webkit-scrollbar]:hidden"
        >

          {courses.map(course => (

            <button
              key={course.slug}
              onClick={() => {

                setSelectedCourse(course);

                navigate(
                  `/interview_qa/${course.slug}`
                );

              }}
              className={`px-4 py-2 rounded-lg transition
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

      <div className="flex flex-1 overflow-hidden">

        <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">

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

                    navigate(
                      `/interview_qa/${selectedCourse.slug}/${topic.slug}`
                    );

                  }}
                  className={`text-left px-4 py-2 rounded-lg
                    transition hover:bg-slate-800
                    ${
                      selectedTopic?.slug === topic.slug
                        ? "bg-slate-800"
                        : ""
                    }
                  `}
                >

                  {topic.title}

                </button>

              ))

            )}

          </div>

        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {loadingQuestions ? (

            <div className="text-slate-400">
              Loading questions...
            </div>

          ) : questions.length === 0 ? (

            <div className="text-slate-400">
              No questions found
            </div>

          ) : (

            questions.map(q => (

              <div
                key={q.id}
                className="mb-10 border-b border-slate-800 pb-6"
              >

                <h2 className="text-xl font-semibold mb-3">

                  {q.title}

                </h2>

                <div
                  className="prose prose-invert max-w-none"
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