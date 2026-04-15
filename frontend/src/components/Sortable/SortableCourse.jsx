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
import ConfirmDialog from "../Modal/ConfirmDialog";

const SortableCourse = 
({
  course,
  expanded,
  toggleCourse,
  setSelectedCourse,
  setShowTopicModal,
  setCourses,
  expandedTopics,
  setExpandedTopics,
  searchQuery
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingTopicReorder, setPendingTopicReorder] = useState(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: course.id });

  const isExpandedBySearch = 
    searchQuery?.length >= 3 && 
    course.topics?.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const isExpanded = expanded[course.id] || isExpandedBySearch;

  const filteredTopics = 
    searchQuery?.length >= 3 
      ? course.topics?.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : course.topics;

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

      setPendingTopicReorder({
        movedTopicTitle: moved.title,
        oldPosition: oldIndex + 1,
        newPosition: newIndex + 1,
        previousTopics: course.topics,
        nextTopics: newTopics
      });

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
                                 questions: questions.questions
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
    setShowDeleteDialog(true);
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
    >

      <div
        className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-800 px-3 py-3 shadow-sm shadow-black/20"
      >

        <div className="flex items-center gap-2 min-w-0">

          <span
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-300"
          >
            ⠿
          </span>

           <span
              className="cursor-pointer"
              onClick={() =>
                toggleCourse(course.id)
              }
            >
              {isExpanded
                ? "▼"
                : "▶"}
            </span>

           <span className="flex min-w-0 items-center">
             <span className="mr-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400/80 shadow-[0_0_0_4px_rgba(129,140,248,0.08)]" />
             <span className="truncate">
               {course.title}
             </span>
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

       {isExpanded &&
         filteredTopics && (
         <DndContext
           collisionDetection={closestCenter}
           onDragEnd={(event) =>
             handleTopicDragEnd(event)
           }
         >
           <SortableContext
             items={filteredTopics.map(
               t => t.id
             )}
             strategy={
               verticalListSortingStrategy
             }
           >
             <div className="ml-6 mt-2 space-y-1">
               {filteredTopics.map(topic => (
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

       {showDeleteDialog && (

         <ConfirmDialog
           title="Delete this course?"
           description={`"${course.title}" and all nested topics and questions will be permanently removed. This action cannot be undone.`}
           confirmLabel="Delete course"
           onCancel={() =>
             setShowDeleteDialog(false)
           }
           onConfirm={async () => {
             await deleteCourseApi(course.id);
             setCourses(prev =>
               prev.filter(c => c.id !== course.id)
             );
             setShowDeleteDialog(false);
           }}
         />

       )}

       {pendingTopicReorder && (

         <ConfirmDialog
           title="Save new topic order?"
           description={`"${pendingTopicReorder.movedTopicTitle}" moved from position ${pendingTopicReorder.oldPosition} to ${pendingTopicReorder.newPosition} inside "${course.title}". Save this topic order to the database?`}
           tone="primary"
           confirmLabel="Save order"
           onCancel={() => {
             setCourses(prev =>
               prev.map(c =>
                 c.id === course.id
                   ? {
                       ...c,
                       topics:
                         pendingTopicReorder.previousTopics
                     }
                   : c
                 )
             );
             setPendingTopicReorder(null);
           }}
           onConfirm={async () => {
             await reorderTopicsApi(
               pendingTopicReorder.nextTopics.map(
                 t => t.id
               ),
               course.id
             );
             setPendingTopicReorder(null);
           }}
         />

       )}

    </div>

  );

};

export default SortableCourse;
