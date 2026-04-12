import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ActionIconButton from "./ActionIconButton";
import ConfirmDialog from "../Modal/ConfirmDialog";
import EditQuestionModal from "../Modal/EditQuestionModal";
import { deleteQuestionApi } from "../../apis/course_manager";
import { getLevelDotClasses } from "../../utilities/levels";

const SortableQuestion = ({
  question,
  course,
  topic,
  setCourses
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform), transition
  };

  const handleDeleteQuestion = async () => {
    setShowDeleteDialog(true);
  };

  return (

    <>

      <div
        ref={setNodeRef}
        style={style}
        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 shadow-sm shadow-black/30"
      >

        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2">

            <span
              {...attributes}
              {...listeners}
              className="cursor-grab text-slate-300"
            >
              ⠿
            </span>

            <span className="h-5 w-px shrink-0 rounded-full bg-slate-800" />

            <span className={`h-2 w-2 shrink-0 rounded-full ${getLevelDotClasses(question.level)}`} />

            <span className="truncate text-sm font-medium text-slate-100">
              {question.title}
            </span>

          </div>

          <div className="flex items-center gap-1 shrink-0">

            <ActionIconButton
              label="Edit Question"
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
              label="Delete Question"
              tone="danger"
              onClick={handleDeleteQuestion}
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

      </div>

      {showEditModal && (

        <EditQuestionModal
          course={course}
          topic={topic}
          question={question}
          onClose={() =>
            setShowEditModal(false)
          }
          onUpdated={(updatedQuestion) => {
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
                                questions:
                                  t.questions.map(q =>
                                    q.id === question.id
                                      ? {
                                          ...q,
                                          title: updatedQuestion.title,
                                          answer: updatedQuestion.answer,
                                          level: updatedQuestion.level
                                        }
                                      : q
                                  )
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
          title="Delete this question?"
          description={`"${question.title}" will be permanently removed from "${topic.title}". This action cannot be undone.`}
          confirmLabel="Delete question"
          onCancel={() =>
            setShowDeleteDialog(false)
          }
          onConfirm={async () => {
            await deleteQuestionApi(question.id);

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
                                questions:
                                  t.questions.filter(q => q.id !== question.id)
                              }
                            : t
                        )
                    }
                  : c
              )
            );

            setShowDeleteDialog(false);
          }}
        />

      )}

    </>

  );

};

export default SortableQuestion;
