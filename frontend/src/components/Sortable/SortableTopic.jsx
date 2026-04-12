import { useState } from "react";

import QuestionsList from "./QuestionsList";
import CreateQuestionModal from "../Modal/CreateQuestionModal";
import { fetchAdminQuestions } from "../../apis/course_manager";

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

  return (

    <div ref={setNodeRef} style={style}>

      <div
        className="bg-slate-900 p-2 rounded flex items-center justify-between gap-3"
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
              toggleTopic(topic.id)
            }
          >
            {expandedTopics[topic.id]
              ? "▼"
              : "▶"}
          </span>

          <span className="truncate">
            {topic.title}
          </span>

        </div>

        <button
          onClick={() =>
            setShowQuestionModal(true)
          }
          className="text-indigo-400 text-sm shrink-0"
        >
          + Create Question
        </button>

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

    </div>

  );

};

export default SortableTopic;
