import { useState } from "react";

import BaseModal from "./BaseModal";
import { updateTopicApi } from "../../apis/course_manager";
import { LEVEL_OPTIONS } from "../../utilities/levels";

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const EditTopicModal = ({
  course,
  topic,
  onClose,
  onUpdated
}) => {

  const [title, setTitle] = useState(topic.title);
  const [level, setLevel] = useState(topic.level || "medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateTopicApi(topic.id, {
      title,
      slug: slugify(title),
      level
    });

    const updatedTopic = await response.json();

    onUpdated(updatedTopic);
    onClose();
  };

  return (

    <BaseModal
      title={`Edit Topic — ${course.title} / ${topic.title}`}
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
          placeholder="Topic Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="bg-slate-800 p-3 rounded"
          required
        />

        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
          className="bg-slate-800 p-3 rounded"
        >
          {LEVEL_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-indigo-600 p-3 rounded"
        >
          Save Topic
        </button>

      </form>

    </BaseModal>

  );

};

export default EditTopicModal;
