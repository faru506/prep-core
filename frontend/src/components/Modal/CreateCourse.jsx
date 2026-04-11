import { useState } from "react";
import Base from "./Base";

import { createCourseApi } from "../../apis/course_manager";

const CreateCourse = ({
  onClose,
  onCreated
}) => {

  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    await createCourseApi({ title, slug });
    onCreated();
    onClose();
  };

  return (

    <Base
      title="Create Course"
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
          Create Course
        </button>

      </form>

    </Base>

  );

};

export default CreateCourse;