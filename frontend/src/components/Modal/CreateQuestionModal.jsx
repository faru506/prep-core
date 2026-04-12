import { useState } from "react";

import BaseModal from "./BaseModal";
import { createQuestionApi } from "../../apis/course_manager";

import RichTextEditor from "../Editor/RichTextEditor";
import { LEVEL_OPTIONS } from "../../utilities/levels";

const CreateQuestionModal = ({
  course,
  topic,
  onClose,
  onCreated
}) => {

  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [level, setLevel] = useState("medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSubmitting(true);
      setError("");

      const response = await createQuestionApi({
        course_id: course.id,
        topic_id: topic.id,
        title,
        answer,
        level
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || payload.message || "Unable to create question.");
      }

      await onCreated(topic.id);
      onClose();

    } catch (submitError) {

      setError(
        submitError.message || "Unable to create question."
      );

    } finally {

      setSubmitting(false);

    }

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

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Course
            </p>
            <p className="mt-2 text-sm font-medium text-slate-100">
              {course.title}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700/70 bg-slate-800/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Topic
            </p>
            <p className="mt-2 text-sm font-medium text-slate-100">
              {topic.title}
            </p>
          </div>

        </div>

        <input
          placeholder="Enter Question"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          required
        />

        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
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

        <RichTextEditor
          value={answer}
          onChange={setAnswer}
        />

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 p-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Creating..."
            : "Create Question"}
        </button>

      </form>

    </BaseModal>

  );

};

export default CreateQuestionModal;
