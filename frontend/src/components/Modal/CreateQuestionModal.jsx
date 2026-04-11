import { useState } from "react";

import BaseModal from "./BaseModal";
import { createQuestionApi } from "../../apis/course_manager";

import RichTextEditor from "../Editor/RichTextEditor";

const CreateQuestionModal = ({
  course,
  topic,
  onClose,
  onCreated
}) => {

  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    await createQuestionApi({

      course_id: course.id,
      topic_id: topic.id,
      title,
      answer

    });

    onCreated(topic.id);
    onClose();

  };

  return (

    <BaseModal
      title={`Create Question — ${course.title} / ${topic.title}`}
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <input
          value={course.title}
          readOnly
          className="bg-slate-800 p-3 rounded opacity-70"
        />

        <input
          value={topic.title}
          readOnly
          className="bg-slate-800 p-3 rounded opacity-70"
        />

        <input
          placeholder="Enter Question"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="bg-slate-800 p-3 rounded"
          required
        />

        <RichTextEditor
          value={answer}
          onChange={setAnswer}
        />

        <button
          type="submit"
          className="bg-indigo-600 p-3 rounded"
        >
          Create Question
        </button>

      </form>

    </BaseModal>

  );

};

export default CreateQuestionModal;