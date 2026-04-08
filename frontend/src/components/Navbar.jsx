import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, removeToken, getRole } from "../utilities/storage";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState(getRole());

  const navigate = useNavigate();

  useEffect(() => {
    setRole(getRole());
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Interview Q&A", path: "/interview_qa" },
    { name: "Programs", path: "/programs" },
    { name: "Contests", path: "/contests" },

    ...(role === "admin"
      ? [{ name: "Users", path: "/users" }]
      : [])
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 transition ${
      isActive
        ? "text-white"
        : "text-slate-300 hover:text-white"
    }`;

  const logoutUser = () => {
    if (getToken()) {
      removeToken();
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="w-full bg-slate-900 border border-slate-800 px-6 py-3">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-10 font-medium">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.name}

                  {isActive && (
                    <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-500 rounded"></span>
                  )}

                </span>
              )}
            </NavLink>
          ))}

        </div>

        <div className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3"
          >

            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-9 h-9 rounded-full border border-slate-700"
            />

          </button>

          {profileOpen && (

            <div className="absolute right-0 mt-3 w-56
                            bg-slate-800 border border-slate-700
                            rounded-xl shadow-lg py-2">

              <button
                className="w-full text-left px-5 py-3
                           text-slate-300 hover:bg-slate-700"
              >
                Your profile
              </button>

              <button
                className="w-full text-left px-5 py-3
                           text-slate-300 hover:bg-slate-700"
              >
                Settings
              </button>

              <div className="border-t border-slate-700 my-1"></div>

              <button
                onClick={logoutUser}
                className="w-full text-left px-5 py-3
                           text-red-400 hover:bg-slate-700"
              >
                Sign out
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;