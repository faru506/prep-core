import { useState } from "react";

import QuestionsList from "./QuestionsList";
import CreateQuestionModal from "../Modal/CreateQuestionModal";
import EditTopicModal from "../Modal/EditTopicModal";
import ConfirmDialog from "../Modal/ConfirmDialog";
import ActionIconButton from "./ActionIconButton";
import {
  fetchAdminQuestions,
  deleteTopicApi
} from "../../apis/course_manager";
import { getLevelDotClasses } from "../../utilities/levels";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTopic = ({
  topic,
  course,
  setCourses,
  expandedTopics,
  toggleTopic
}) => {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform), transition
  };

  const handleDeleteTopic = async () => {
    setShowDeleteDialog(true);
  };

  return (

    <div ref={setNodeRef} style={style}>

      <div
        className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-900 px-3 py-2.5 shadow-sm shadow-black/20"
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
              toggleTopic(topic.id)
            }
          >
            {expandedTopics[topic.id]
              ? "▼"
              : "▶"}
          </span>

          <span className="flex min-w-0 items-center">
            <span className={`mr-2 inline-flex h-2 w-2 shrink-0 rounded-full ${getLevelDotClasses(topic.level)}`} />
            <span className="truncate">
              {topic.title}
            </span>
          </span>

        </div>

        <div className="flex items-center gap-1 shrink-0">

          <ActionIconButton
            label="Create Question"
            tone="primary"
            onClick={() =>
              setShowQuestionModal(true)
            }
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </ActionIconButton>

          <ActionIconButton
            label="Edit Topic"
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
            label="Delete Topic"
            tone="danger"
            onClick={handleDeleteTopic}
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

      {expandedTopics[topic.id] &&
        topic.questions && (

        <QuestionsList
          topic={topic}
          course={course}
          setCourses={setCourses}
        />

      )}

      {showQuestionModal && (

        <CreateQuestionModal
          course={course}
          topic={topic}
          onClose={() =>
            setShowQuestionModal(false)
          }
          onCreated={async () => {

            const res =
              await fetchAdminQuestions(topic.id);

            const questions =
              await res.json();

            setCourses(prev =>
              prev.map(c =>
                c.id === course.id
                  ? {
                      ...c,
                      topics:
                        c.topics.map(t =>
                          t.id === topic.id
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

          }}
        />

      )}

      {showEditModal && (

        <EditTopicModal
          course={course}
          topic={topic}
          onClose={() =>
            setShowEditModal(false)
          }
          onUpdated={(updatedTopic) => {
            setCourses(prev =>
              prev.map(c =>
                c.id === course.id
                  ? {
                      ...c,
                      topics:
                        c.topics.map(t =>
                          t.id === topic.id
                            ? {
                                ...t,
                                title: updatedTopic.title,
                                slug: updatedTopic.slug,
                                level: updatedTopic.level
                              }
                            : t
                        )
                    }
                  : c
              )
            );

          }}
        />

      )}

      {showDeleteDialog && (

        <ConfirmDialog
          title="Delete this topic?"
          description={`"${topic.title}" and all of its questions will be permanently removed. This action cannot be undone.`}
          confirmLabel="Delete topic"
          onCancel={() =>
            setShowDeleteDialog(false)
          }
          onConfirm={async () => {
            await deleteTopicApi(topic.id);

            setCourses(prev =>
              prev.map(c =>
                c.id === course.id
                  ? {
                      ...c,
                      topics: c.topics.filter(t => t.id !== topic.id)
                    }
                  : c
              )
            );

            setShowDeleteDialog(false);
          }}
        />

      )}

    </div>

  );

};

export default SortableTopic;
