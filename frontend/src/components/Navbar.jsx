import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "../assets/menu.svg?react";
import CloseIcon from "../assets/close.svg?react";
import { getToken, removeToken } from "../utilities/storage";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Interview Q&A", path: "/interview_qa" },
    { name: "Programs", path: "/programs" },
    { name: "Contests", path: "/contests" },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 transition ${
      isActive
        ? "text-white"
        : "text-slate-300 hover:text-white"
    }`;

  const removeUser = () => {
    if (getToken()) {
      removeToken();
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="w-full bg-slate-900 border border-slate-800 px-6 py-3">

      <div className="flex items-center justify-between">

        <div className="hidden md:flex items-center gap-10 font-medium">

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
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-300 hover:text-white"
          >
            {menuOpen
              ? <CloseIcon className="w-6 h-6" />
              : <MenuIcon className="w-6 h-6" />}
          </button>

          {menuOpen && (

            <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2">

              <button
                onClick={removeUser}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;