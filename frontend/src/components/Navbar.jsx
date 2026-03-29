import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 transition ${
      isActive
        ? "text-white"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <nav className="w-full bg-slate-900 border border-slate-800 px-6 py-3">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-10">

          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg"></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">

            <NavLink to="/" className={navLinkClass}>
              Challenges
            </NavLink>

            <NavLink to="/topics" className={navLinkClass}>
              Topics
            </NavLink>

          </div>

        </div>

        <div className="flex items-center gap-5">

          <div className="relative">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full overflow-hidden border border-slate-700"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2">

                <button className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700">
                  Settings
                </button>

                <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700">
                  Logout
                </button>

              </div>
            )}

          </div>

          <button
            className="md:hidden text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

        </div>

      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 font-medium">

          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/team" className={navLinkClass}>
            Teams
          </NavLink>

        </div>
      )}

    </nav>
  );
};

export default Navbar;