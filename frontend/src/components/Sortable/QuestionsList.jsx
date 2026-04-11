import { useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { reorderQuestionsApi, fetchAdminQuestions } from "../../apis/course_manager";

import SortableQuestion from "./SortableQuestion";
import CreateQuestionModal from "../Modal/CreateQuestionModal";

const QuestionsList = ({
  topic,
  course,
  setCourses
}) => {

  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleDragEnd = async (event) => {

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {

      const oldIndex =
        topic.questions.findIndex(
          q => q.id === active.id
        );

      const newIndex =
        topic.questions.findIndex(
          q => q.id === over.id
        );

      const newQuestions = [...topic.questions];

      const [moved] =
          newQuestions.splice(
            oldIndex, 1
          );

      newQuestions.splice(
          newIndex, 0, moved
      );

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
                            newQuestions
                        }
                      : t
                  )
              }
            : c
        )
      );

      await reorderQuestionsApi(
          newQuestions.map(
            q => q.id
          ),
        topic.id
      );

    }

  };

  return (

    <>

      <DndContext
      collisionDetection={
        closestCenter
      }
        onDragEnd={handleDragEnd}
      >

        <SortableContext
          items={topic.questions.map(
            q => q.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >

          <div className="ml-6 mt-2 space-y-1">

            {topic.questions.map(q => (

              <SortableQuestion
                key={q.id}
                question={q}
              />

            ))}

            <button
              onClick={() =>
                setShowQuestionModal(true)
              }
              className="text-indigo-400 text-sm mt-2"
            >
              + Create Question
            </button>

          </div>

        </SortableContext>

      </DndContext>

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
                                questions
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

    </>

  );

};

export default QuestionsList;