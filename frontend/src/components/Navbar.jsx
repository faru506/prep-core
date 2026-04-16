import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, removeToken, getRole } from "../utilities/storage";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(getRole());

  const navigate = useNavigate();

  useEffect(() => {
    setRole(getRole());
  }, []);

  const navItems = [
    { name: "Interview Q&A", path: "/interview_qa" },
    { name: "Programs", path: "/programs" },
    { name: "Contests", path: "/contests" },

    ...(role === "admin"
      ? [{ name: "Users", path: "/users" },
         { name: "Course Manager", path: "/course_manager" }
      ]
      : [])
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 transition duration-300 ${
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

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="w-full bg-slate-900/95 backdrop-blur-sm border border-slate-800 px-4 md:px-6 py-3 sticky top-0 z-[100]">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4 md:gap-10 font-medium">

           <NavLink to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
             PrepCore
           </NavLink>

          <div className="hidden md:flex items-center gap-2">
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

        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-700"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-4 md:right-0 top-16 md:mt-3 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-lg py-2 animate-fade-in z-50">
              <button
                className="w-full text-left px-5 py-3 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Your profile
              </button>
              <button
                className="w-full text-left px-5 py-3 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Settings
              </button>
              <div className="border-t border-slate-700 my-1"></div>
              <button
                onClick={logoutUser}
                className="w-full text-left px-5 py-3 text-red-400 hover:bg-slate-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <div className="flex flex-col gap-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;