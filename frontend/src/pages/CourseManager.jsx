import { useEffect, useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { reorderCoursesApi, fetchAdminCourses, fetchAdminTopics } from "../apis/course_manager";
import CreateCourse from "../components/Modal/CreateCourse";
import CreateTopic from "../components/Modal/CreateTopic";
import SortableCourse from "../components/Sortable/Course"

const CourseManager = () => {

  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const res = await fetchAdminCourses();
    const data = await res.json();
    setCourses(data);
  };

  const loadTopics = async (courseId) => {
    const res = await fetchAdminTopics(courseId);
    const topics = await res.json();

    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
              ...course,
              topics
            }
          : course
      )
    );

  };

  const toggleCourse = async (courseId) => {

      setExpanded(prev => ({
        ...prev,
        [courseId]:
          !prev[courseId]
      }));

      const course =
        courses.find(
          c => c.id === courseId
        );

      if (!course.topics) {
        await loadTopics(courseId);
      }

    };

  const handleDragEnd = async (event) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id !== over.id) {
        const oldIndex =
          courses.findIndex(
            c => c.id === active.id
          );

        const newIndex =
          courses.findIndex(
            c => c.id === over.id
          );

        const newCourses = [...courses];

        const [moved] =
          newCourses.splice(
            oldIndex,
            1
          );

        newCourses.splice(
          newIndex,
          0,
          moved
        );

        setCourses(newCourses);

        await reorderCoursesApi(
          newCourses.map(
            c => c.id
          )
        );

      }

    };

  return (

    <div className="p-6 text-white">
      <div className="flex justify-between mb-6">

        <h1 className="text-2xl">
          Course Manager
        </h1>

        <button
          onClick={() =>
            setShowCourseModal(true)
          }
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          + Create Course
        </button>

      </div>

      <DndContext
        collisionDetection={
          closestCenter
        }
        onDragEnd={
          handleDragEnd
        }
      >

        <SortableContext
          items={
            courses.map(
              c => c.id
            )
          }
          strategy={
            verticalListSortingStrategy
          }
        >

          <div className="space-y-2">

            {courses.map(course => (

              <SortableCourse
                key={course.id}
                course={course}
                expanded={expanded}
                toggleCourse={toggleCourse}
                setSelectedCourse={setSelectedCourse}
                setShowTopicModal={setShowTopicModal}
                setCourses={setCourses}
                expandedTopics={expandedTopics}
                setExpandedTopics={setExpandedTopics}
              />

            ))}

          </div>

        </SortableContext>

      </DndContext>

      {showCourseModal && (

        <CreateCourse
          onClose={() =>
            setShowCourseModal(false)
          }
          onCreated={loadCourses}
        />

      )}

      {showTopicModal &&
        selectedCourse && (

        <CreateTopic
          course={selectedCourse}
          onClose={() =>
            setShowTopicModal(false)
          }
          onCreated={() =>
            loadTopics(
              selectedCourse.id
            )
          }
        />

      )}

    </div>

  );

};

export default CourseManager;