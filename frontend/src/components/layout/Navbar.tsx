import { Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/problems", label: "Problems" },
  { to: "/interview", label: "Interview Q&A" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {

  return (
    <nav className="bg-white border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600"
        >
          InterviewPrep
        </Link>

        {/* Links */}
        <div className="flex gap-6">

          {NAV_LINKS.map((link) => (

            <Link
              key={link.to}
              to={link.to}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              {link.label}
            </Link>

          ))}

        </div>

      </div>

    </nav>
  );
}