import { useState } from "react";

import BaseModal from "./BaseModal";
import {
  createUserApi,
  updateUserApi
} from "../../apis/users";

const ROLE_OPTIONS = ["user", "admin"];

const UserModal = ({
  mode = "create",
  user,
  onClose,
  onSaved
}) => {

  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    role: user?.role || "user",
    password: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      setSubmitting(true);
      setError("");

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role: form.role
      };

      if (!isEdit || form.password.trim()) {
        payload.password = form.password;
      }

      const response = isEdit
        ? await updateUserApi(user.id, payload)
        : await createUserApi(payload);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || "Unable to save user.");
      }

      const savedUser = await response.json();

      onSaved(savedUser);
      onClose();

    } catch (submitError) {

      setError(
        submitError.message || "Unable to save user."
      );

    } finally {

      setSubmitting(false);

    }
  };

  return (

    <BaseModal
      title={isEdit ? "Edit User" : "Add User"}
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <div className="grid gap-4 md:grid-cols-2">

          <input
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            required
          />

          <input
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            required
          />

        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          required
        />

        <div className="grid gap-4 md:grid-cols-2">

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <input
            name="password"
            type="password"
            placeholder={isEdit ? "New password (optional)" : "Password"}
            value={form.password}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            required={!isEdit}
          />

        </div>

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
            ? (isEdit ? "Saving..." : "Creating...")
            : (isEdit ? "Save User" : "Create User")}
        </button>

      </form>

    </BaseModal>

  );

};

export default UserModal;
