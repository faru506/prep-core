import { useEffect, useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { reorderCoursesApi, reorderTopicsApi, fetchAdminCourses, fetchAdminTopics } from "../apis/course_manager";
import CreateCourseModal from "../components/CreateCourseModal";
import CreateTopicModal from "../components/CreateTopicModal";

const SortableCourse = 
({
  course,
  expanded,
  toggleCourse,
  setSelectedCourse,
  setShowTopicModal,
  setCourses
}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform), transition
  };

  const handleTopicDragEnd = async (event) => {

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {

      const oldIndex =
        course.topics.findIndex(
          t => t.id === active.id
        );

      const newIndex =
        course.topics.findIndex(
          t => t.id === over.id
        );

      const newTopics =
        [...course.topics];

      const [moved] =
        newTopics.splice(
          oldIndex,
          1
        );

      newTopics.splice(
        newIndex,
        0,
        moved
      );

      /* 🔥 Update UI */

      setCourses(prev =>
        prev.map(c =>
          c.id === course.id
            ? { ...c, topics: newTopics }
            : c
        )
      );

      /* 🔥 Save order */

      await reorderTopicsApi(
        newTopics.map(t => t.id)
      );

    }

  };

  return (

    <div
      ref={setNodeRef}
      style={style}
    >

      <div
        className="flex items-center gap-2
                   bg-slate-800 p-3 rounded"
      >

        <span
          {...attributes}
          {...listeners}
          className="cursor-grab"
        >
          ⠿
        </span>

        <span
          className="cursor-pointer"
          onClick={() =>
            toggleCourse(course.id)
          }
        >
          {expanded[course.id]
            ? "▼"
            : "▶"}
        </span>

        {course.title}

      </div>

      {expanded[course.id] &&
        course.topics && (

        <div className="ml-6 mt-2 space-y-1">

          <DndContext
            collisionDetection={ closestCenter }
            onDragEnd={ handleTopicDragEnd }
          >
            <SortableContext
              items={
                course.topics.map(
                  t => t.id
                )
              }
              strategy={
                verticalListSortingStrategy
              }
            >

              {course.topics.map(topic => (
                <SortableTopic
                  key={topic.id}
                  topic={topic}
                />

              ))}

            </SortableContext>

          </DndContext>

          <button
            onClick={() => {

              setSelectedCourse(course);

              setShowTopicModal(true);

            }}
            className="text-indigo-400 text-sm mt-2"
          >
            + Create Topic
          </button>

        </div>

      )}

    </div>

  );

};

const SortableTopic = ({
  topic
}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: topic.id
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-900 p-2 rounded flex gap-2"
    >

      <span
        {...attributes}
        {...listeners}
        className="cursor-grab"
      >
        ⠿
      </span>

      {topic.title}

    </div>

  );

};

const CourseManager = () => {

  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
              />

            ))}

          </div>

        </SortableContext>

      </DndContext>

      {showCourseModal && (

        <CreateCourseModal
          onClose={() =>
            setShowCourseModal(false)
          }
          onCreated={loadCourses}
        />

      )}

      {showTopicModal &&
        selectedCourse && (

        <CreateTopicModal
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