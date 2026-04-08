import { useEffect, useState } from "react";
import { getToken } from "../utilities/storage";
import { fetchUsersApi } from "../apis/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = getToken();

      const response = await fetchUsersApi(token);

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

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-white">
            Users
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            A list of all users in your platform.
          </p>
        </div>

        <button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700
                     text-white text-sm font-medium
                     rounded-lg transition"
        >
          Add user
        </button>

      </div>

      {/* Table */}

      <div className="overflow-hidden border border-slate-800 rounded-xl">

        <table className="min-w-full divide-y divide-slate-800">

          <thead className="bg-slate-900">

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

            {users.map((user) => (

              <tr
                key={user._id}
                className="hover:bg-slate-900 transition"
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

                  <button
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    Edit
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Empty State */}

      {users.length === 0 && (

        <div className="text-center text-slate-400 mt-10">
          No users found.
        </div>

      )}

    </div>
  );
};

export default Users;