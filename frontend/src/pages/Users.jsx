import { useEffect, useState } from "react";
import {
  fetchUsersApi,
  deleteUserApi
} from "../apis/users";
import ActionIconButton from "../components/Sortable/ActionIconButton";
import ConfirmDialog from "../components/Modal/ConfirmDialog";
import UserModal from "../components/Modal/UserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const USERS_PER_PAGE = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchUsersApi();

      if (!response.ok) {
        console.error("Failed to fetch users");
        setLoading(false);
        return;
      }

      const data = await response.json();

      setUsers(data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const totalPages =
    Math.max(
      1,
      Math.ceil(users.length / USERS_PER_PAGE)
    );

  const paginatedUsers =
    users.slice(
      (currentPage - 1) * USERS_PER_PAGE,
      currentPage * USERS_PER_PAGE
    );

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 px-5 py-5 shadow-[0_18px_40px_rgba(2,6,23,0.22)]">

        <div>
          <h1 className="text-2xl font-semibold text-white">
            Users
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            A list of all users in your platform.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            {users.length} total users
          </div>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setShowUserModal(true);
          }}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Add user
        </button>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_18px_40px_rgba(2,6,23,0.18)]">

        <table className="min-w-full divide-y divide-slate-800">

          <thead className="bg-slate-900/90">

            <tr>

              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                Name
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                Email
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                Role
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-800 bg-slate-950">

            {paginatedUsers.map((user) => (

              <tr
                key={user.id}
                className="transition hover:bg-slate-900/80"
              >

                {/* Name */}

                <td className="px-6 py-4 text-sm text-white">

                  {user.first_name || "-"}{" "}
                  {user.last_name || ""}

                </td>

                {/* Email */}

                <td className="px-6 py-4 text-sm text-slate-300">

                  {user.email}

                </td>

                {/* Role Badge */}

                <td className="px-6 py-4">

                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full
                    ${
                      user.role === "admin"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {user.role}
                  </span>

                </td>

                {/* Edit Button */}

                <td className="px-6 py-4 text-right">

                  <div className="flex justify-end gap-1">

                    <ActionIconButton
                      label="Edit User"
                      onClick={() => {
                        setEditingUser(user);
                        setShowUserModal(true);
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                        <path d="M4 20h4l10-10-4-4L4 16v4Z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m12 6 4 4" strokeLinecap="round" />
                      </svg>
                    </ActionIconButton>

                    <ActionIconButton
                      label="Delete User"
                      tone="danger"
                      onClick={() =>
                        setDeletingUser(user)
                      }
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                        <path d="M4 7h16" strokeLinecap="round" />
                        <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 11v5M14 11v5" strokeLinecap="round" />
                      </svg>
                    </ActionIconButton>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {users.length === 0 && (

        <div className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-10 text-center text-slate-400">
          No users found.
        </div>

      )}

      {users.length > USERS_PER_PAGE && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">

          <p className="text-sm text-slate-400">
            Showing {(currentPage - 1) * USERS_PER_PAGE + 1}-
            {Math.min(currentPage * USERS_PER_PAGE, users.length)} of {users.length} users
          </p>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setCurrentPage(page => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage(page => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}

      {showUserModal && (
        <UserModal
          mode={editingUser ? "edit" : "create"}
          user={editingUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSaved={(savedUser) => {
            setUsers(prev => {
              const existing =
                prev.find(current => current.id === savedUser.id);

              const nextUsers = existing
                ? prev.map(current =>
                    current.id === savedUser.id
                      ? savedUser
                      : current
                  )
                : [savedUser, ...prev];

              return nextUsers;
            });
            setCurrentPage(1);
          }}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Delete this user?"
          description={`"${deletingUser.first_name} ${deletingUser.last_name}" will be permanently removed. This action cannot be undone.`}
          confirmLabel="Delete user"
          onCancel={() =>
            setDeletingUser(null)
          }
          onConfirm={async () => {
            await deleteUserApi(deletingUser.id);
            setUsers(prev =>
              prev.filter(user => user.id !== deletingUser.id)
            );
            setDeletingUser(null);
            setCurrentPage(page =>
              Math.min(
                page,
                Math.max(
                  1,
                  Math.ceil((users.length - 1) / USERS_PER_PAGE)
                )
              )
            );
          }}
        />
      )}

    </div>
  );
};

export default Users;
