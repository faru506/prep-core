import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Question = ({
  question
}) => {

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

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-950 p-2 rounded flex gap-2"
    >

      <span
        {...attributes}
        {...listeners}
        className="cursor-grab"
      >
        ⠿
      </span>

      {question.title}

    </div>

  );

};

export default Question;