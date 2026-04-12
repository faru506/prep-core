import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { reorderTopicsApi, fetchAdminQuestions } from "../../apis/course_manager";
import SortableTopic from "./SortableTopic";

const SortableCourse = 
({
  course,
  expanded,
  toggleCourse,
  setSelectedCourse,
  setShowTopicModal,
  setCourses,
  expandedTopics,
  setExpandedTopics
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

      setCourses(prev =>
        prev.map(c =>
          c.id === course.id
            ? { ...c, topics: newTopics }
            : c
        )
      );

      await reorderTopicsApi(
        newTopics.map(t => t.id),
        course.id
      );

    }

  };

  const toggleTopic = async (topicId) => {

    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));

    const topic =
      course.topics.find(
        t => t.id === topicId
      );

    if (!topic.questions) {

      const res =
        await fetchAdminQuestions(
          topicId
        );

      const questions =
        await res.json();

      setCourses(prev =>
        prev.map(c =>
          c.id === course.id
            ? {
                ...c,
                topics:
                  c.topics.map(t =>
                    t.id === topicId
                      ? {
                          ...t,
                          questions
                        }
                      : t
                  )
              }
            : c
        )
      );

    }

  };

  return (

    <div
      ref={setNodeRef}
      style={style}
    >

      <div
        className="flex items-center justify-between
                   gap-3 bg-slate-800 p-3 rounded"
      >

        <div className="flex items-center gap-2 min-w-0">

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

          <span className="truncate">
            {course.title}
          </span>

        </div>

        <button
          onClick={() => {
            setSelectedCourse(course);
            setShowTopicModal(true);
          }}
          className="text-indigo-400 text-sm shrink-0"
        >
          + Create Topic
        </button>

      </div>

      {expanded[course.id] &&
        course.topics && (

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) =>
            handleTopicDragEnd(event)
          }
        >

          <SortableContext
            items={course.topics.map(
              t => t.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >

            <div className="ml-6 mt-2 space-y-1">

              {course.topics.map(topic => (
                <SortableTopic
                  key={topic.id}
                  topic={topic}
                  course={course}
                  setCourses={setCourses}
                  expandedTopics={expandedTopics}
                  toggleTopic={toggleTopic}
                />

              ))}
            </div>

          </SortableContext>

        </DndContext>

      )}

    </div>

  );

};

export default SortableCourse;
