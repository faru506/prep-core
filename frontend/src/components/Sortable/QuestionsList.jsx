import { useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { reorderQuestionsApi } from "../../apis/course_manager";

import SortableQuestion from "./SortableQuestion";
import ConfirmDialog from "../Modal/ConfirmDialog";

const QuestionsList = ({
  topic,
  course,
  setCourses
}) => {
  const [pendingQuestionReorder, setPendingQuestionReorder] = useState(null);

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

      setPendingQuestionReorder({
        movedQuestionTitle: moved.title,
        oldPosition: oldIndex + 1,
        newPosition: newIndex + 1,
        previousQuestions: topic.questions,
        nextQuestions: newQuestions
      });

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
                course={course}
                topic={topic}
                setCourses={setCourses}
              />

            ))}
          </div>

        </SortableContext>

      </DndContext>

      {pendingQuestionReorder && (

        <ConfirmDialog
          title="Save new question order?"
          description={`"${pendingQuestionReorder.movedQuestionTitle}" moved from position ${pendingQuestionReorder.oldPosition} to ${pendingQuestionReorder.newPosition} inside "${topic.title}". Save this question order to the database?`}
          tone="primary"
          confirmLabel="Save order"
          onCancel={() => {
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
                                  pendingQuestionReorder.previousQuestions
                              }
                            : t
                        )
                    }
                  : c
              )
            );
            setPendingQuestionReorder(null);
          }}
          onConfirm={async () => {
            await reorderQuestionsApi(
              pendingQuestionReorder.nextQuestions.map(
                q => q.id
              ),
              topic.id
            );
            setPendingQuestionReorder(null);
          }}
        />

      )}

    </>

  );

};

export default QuestionsList;
