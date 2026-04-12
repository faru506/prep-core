import { useState } from "react";

import QuestionsList from "./QuestionsList";
import CreateQuestionModal from "../Modal/CreateQuestionModal";
import EditTopicModal from "../Modal/EditTopicModal";
import ActionIconButton from "./ActionIconButton";
import {
  fetchAdminQuestions,
  deleteTopicApi
} from "../../apis/course_manager";

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

    const confirmed = window.confirm(
      `Delete the topic "${topic.title}" and all its questions?`
    );

    if (!confirmed) return;

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
                                slug: updatedTopic.slug
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
