import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import {
  reorderTopicsApi,
  fetchAdminQuestions,
  deleteCourseApi
} from "../../apis/course_manager";
import SortableTopic from "./SortableTopic";
import ActionIconButton from "./ActionIconButton";
import EditCourseModal from "../Modal/EditCourseModal";

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
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleDeleteCourse = async () => {

    const confirmed = window.confirm(
      `Delete the course "${course.title}" and all its topics/questions?`
    );

    if (!confirmed) return;

    await deleteCourseApi(course.id);
    setCourses(prev =>
      prev.filter(c => c.id !== course.id)
    );
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

        <div className="flex items-center gap-1 shrink-0">

          <ActionIconButton
            label="Create Topic"
            tone="primary"
            onClick={() => {
              setSelectedCourse(course);
              setShowTopicModal(true);
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </ActionIconButton>

          <ActionIconButton
            label="Edit Course"
            onClick={() =>
              setShowEditModal(true)
            }
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
              <path d="M4 20h4l10-10-4-4L4 16v4Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m12 6 4 4" strokeLinecap="round" />
            </svg>
          </ActionIconButton>

          <ActionIconButton
            label="Delete Course"
            tone="danger"
            onClick={handleDeleteCourse}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
              <path d="M4 7h16" strokeLinecap="round" />
              <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11v5M14 11v5" strokeLinecap="round" />
            </svg>
          </ActionIconButton>

        </div>

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

      {showEditModal && (

        <EditCourseModal
          course={course}
          onClose={() =>
            setShowEditModal(false)
          }
          onUpdated={(updatedCourse) =>
            setCourses(prev =>
              prev.map(c =>
                c.id === course.id
                  ? {
                      ...c,
                      title: updatedCourse.title,
                      slug: updatedCourse.slug
                    }
                  : c
              )
            )
          }
        />

      )}

    </div>

  );

};

export default SortableCourse;
