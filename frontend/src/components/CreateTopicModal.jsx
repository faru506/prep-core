import { useState } from "react";
import Modal from "./Modal";

import { createTopicApi } from "../apis/course_manager";

const CreateTopicModal = ({
  course,
  onClose,
  onCreated
}) => {

  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    await createTopicApi({ course_id: course.id, title, slug });

    onCreated(course.id);
    onClose();

  };

  return (

    <Modal
      title={`Create Topic — ${course.title}`}
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <input
          placeholder="Topic Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="bg-slate-800 p-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 p-3 rounded"
        >
          Create Topic
        </button>

      </form>

    </Modal>

  );

};

export default CreateTopicModal;