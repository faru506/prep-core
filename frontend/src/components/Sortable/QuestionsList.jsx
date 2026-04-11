import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { reorderQuestionsApi } from "../../apis/course_manager";
import Question from "./Question";

const QuestionsList = ({
  topic,
  course,
  setCourses
}) => {

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

            <Question
              key={q.id}
              question={q}
            />

          ))}

          <button
            onClick={() =>
              window.open(
                `/course_manager/${course.slug}/${topic.slug}/questions`,
                "_blank"
              )
            }
            className="text-indigo-400 text-sm mt-2"
          >
            + Create Question
          </button>

        </div>

      </SortableContext>

    </DndContext>

  );

};

export default QuestionsList;