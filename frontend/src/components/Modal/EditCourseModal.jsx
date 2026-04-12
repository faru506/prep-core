import { useState } from "react";

import BaseModal from "./BaseModal";
import { updateCourseApi } from "../../apis/course_manager";

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const EditCourseModal = ({
  course,
  onClose,
  onUpdated
}) => {

  const [title, setTitle] = useState(course.title);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateCourseApi(course.id, {
      title,
      slug: slugify(title)
    });

    const updatedCourse = await response.json();

    onUpdated(updatedCourse);
    onClose();
  };

  return (

    <BaseModal
      title={`Edit Course — ${course.title}`}
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <input
          placeholder="Course Title"
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
          Save Course
        </button>

      </form>

    </BaseModal>

  );

};

export default EditCourseModal;
