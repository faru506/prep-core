import SortableQuestionsList from "./QuestionsList";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTopic = ({
  topic,
  course,
  setCourses,
  expandedTopics,
  toggleTopic
}) => {

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
        className="bg-slate-900 p-2 rounded flex gap-2 items-center"
      >

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

        {topic.title}

      </div>

      {expandedTopics[topic.id] &&
        topic.questions && (

        <SortableQuestionsList
          topic={topic}
          course={course}
          setCourses={setCourses}
        />

      )}

    </div>

  );

};

export default SortableTopic;