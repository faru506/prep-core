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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("first_name");
  const [sortDirection, setSortDirection] = useState("asc");

  const USERS_PER_PAGE = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchUsersApi();

      if (!response.ok) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUsers(data);

    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || 
           user.email.toLowerCase().includes(searchLower) ||
           user.role.toLowerCase().includes(searchLower);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortField] || "";
    let bVal = b[sortField] || "";
    
    if (sortField === "first_name" || sortField === "last_name") {
      aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
      bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / USERS_PER_PAGE));

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">
      
      <div className="relative mb-6 md:mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-cyan-900/10 rounded-2xl" />
        <div className="absolute top-0 left-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Users
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage and view all registered users in your platform.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                {users.length} total users
              </div>
            </div>

            <button
              onClick={() => {
                setEditingUser(null);
                setShowUserModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50">
              <tr>
                <th 
                  className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("first_name")}
                >
                  <div className="flex items-center gap-2">
                    User
                    <SortIcon field="first_name" />
                  </div>
                </th>
                <th 
                  className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th 
                  className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-2">
                    Role
                    <SortIcon field="role" />
                  </div>
                </th>
                <th className="px-4 md:px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 bg-slate-900/30">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-800/50 group"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${user.role === 'admin' ? 'bg-indigo-400' : 'bg-green-400'}`}></span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 md:px-6 py-4">
                      <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border
                        ${
                          user.role === "admin"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.role === "admin" ? "bg-indigo-400" : "bg-green-400"}`}></span>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 md:px-6 py-4">
                      <div className="flex justify-end gap-2">
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
                          onClick={() => setDeletingUser(user)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sortedUsers.length > USERS_PER_PAGE && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 md:px-6 py-4">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white font-medium">{(currentPage - 1) * USERS_PER_PAGE + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * USERS_PER_PAGE, sortedUsers.length)}</span> of <span className="text-white font-medium">{sortedUsers.length}</span> users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition
                    ${currentPage === i + 1 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
              const existing = prev.find(current => current.id === savedUser.id);
              return existing
                ? prev.map(current => current.id === savedUser.id ? savedUser : current)
                : [savedUser, ...prev];
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
          onCancel={() => setDeletingUser(null)}
          onConfirm={async () => {
            await deleteUserApi(deletingUser.id);
            setUsers(prev => prev.filter(user => user.id !== deletingUser.id));
            setDeletingUser(null);
            if (paginatedUsers.length === 1 && currentPage > 1) {
              setCurrentPage(prev => prev - 1);
            }
          }}
        />
      )}
    </div>
  );
};

export default Users;