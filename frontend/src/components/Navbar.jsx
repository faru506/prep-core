import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, removeToken, getRole, getTokenPayload } from "../utilities/storage";
import {
  BookMarked,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const formatDisplayName = (email = "") => {
  const localPart = email.split("@")[0];

  if (!localPart) {
    return "PrepCore User";
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getProfileDetails = () => {
  const payload = getTokenPayload();
  const email = payload?.email || "";
  const role = payload?.role || null;
  const name = formatDisplayName(email);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "PC";

  return {
    email,
    initials,
    name,
    role
  };
};

const Navbar = () => {
  const [role, setRole] = useState(getRole());
  const [profile, setProfile] = useState(getProfileDetails());
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getRole());
    setProfile(getProfileDetails());
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const navItems = [
    { name: "Interview Q&A", path: "/interview_qa" },
    { name: "Bookmarked Items", path: "/bookmarks" },
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
      setProfileOpen(false);
      navigate("/login", { replace: true });
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 px-4 md:px-6 py-3 sticky top-0 z-[100]">
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
          <div className="relative flex items-center gap-3" ref={profileMenuRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-2.5 py-2 transition-all duration-300 ${
                profileOpen
                  ? "border-cyan-400/40 bg-slate-800/95 shadow-[0_12px_40px_rgba(34,211,238,0.16)]"
                  : "border-slate-700/80 bg-slate-900/90 hover:border-slate-500 hover:bg-slate-800/95"
              }`}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
                {profile.initials}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.22),_transparent_34%)] opacity-80" />
              <div className="relative hidden text-left md:block">
                <p className="max-w-32 truncate text-sm font-semibold text-white">
                  {profile.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.75)]" />
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-300">
                    {role === "admin" ? "Admin mode" : "Learner"}
                  </p>
                </div>
              </div>
              <ChevronDown className={`relative hidden h-4 w-4 text-slate-400 transition-transform duration-300 md:block ${profileOpen ? "rotate-180 text-cyan-300" : "group-hover:text-white"}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[21rem] overflow-hidden rounded-[1.75rem] border border-slate-700/80 bg-slate-900/95 shadow-[0_24px_80px_rgba(15,23,42,0.65)] backdrop-blur-2xl animate-fade-in">
                <div className="relative overflow-hidden border-b border-white/10 px-5 py-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.28),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))]" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-lg font-black text-white shadow-[0_12px_32px_rgba(79,70,229,0.32)] ring-1 ring-white/10">
                      {profile.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">
                          <Sparkles className="h-3 w-3" />
                          Active
                        </span>
                        {role === "admin" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="truncate text-lg font-semibold text-white">{profile.name}</p>
                      <p className="truncate text-sm text-slate-300">{profile.email || "Signed in user"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <NavLink
                    to="/interview_qa"
                    onClick={handleNavClick}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-slate-800/70 px-4 py-3 transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Continue learning</p>
                        <p className="text-xs text-slate-400">Jump back into interview prep</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-cyan-300">
                      Open
                    </span>
                  </NavLink>

                  <NavLink
                    to="/bookmarks"
                    onClick={handleNavClick}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-slate-800/70 px-4 py-3 transition-all duration-300 hover:border-indigo-400/30 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-400/10 p-2 text-indigo-300">
                        <BookMarked className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Bookmarked items</p>
                        <p className="text-xs text-slate-400">Pick up your saved questions</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-indigo-300">
                      Open
                    </span>
                  </NavLink>

                  {role === "admin" && (
                    <NavLink
                      to="/course_manager"
                      onClick={handleNavClick}
                      className="group flex items-center justify-between rounded-2xl border border-transparent bg-slate-800/70 px-4 py-3 transition-all duration-300 hover:border-violet-400/30 hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-400/10 p-2 text-violet-300">
                          <LayoutDashboard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Admin workspace</p>
                          <p className="text-xs text-slate-400">Manage users, courses, and topics</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-violet-300">
                        Open
                      </span>
                    </NavLink>
                  )}
                </div>

                <div className="border-t border-white/10 bg-slate-950/70 p-3">
                  <button
                    onClick={logoutUser}
                    className="flex w-full items-center justify-between rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-left transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/12"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-red-500/12 p-2 text-red-300">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-200">Sign out</p>
                        <p className="text-xs text-red-200/70">End this session securely</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200/60">
                      Exit
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

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
