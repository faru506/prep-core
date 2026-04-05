import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginApi, registerApi } from "../apis/authentication";
import { saveToken } from "../utilities/storage";

const Authentication = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode =
    location.pathname === "/register"
      ? "register"
      : "login";

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (mode === "login") {
        response = await loginApi(form);
      } else {
        response = await registerApi(form);
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Auth Error:", errorData);
        alert("Authentication failed");
        return;
      }

      const token = response.headers?.get("Authorization");

      if (token) {
        saveToken(token);
      }

      navigate("/");

    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg w-96 space-y-4"
      >

        <h2 className="text-2xl font-bold text-center">

          {mode === "login"
            ? "Login"
            : "Register"}

        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800"
          required
        />

        <button
          type="submit"
          className={`w-full p-2 rounded ${
            mode === "login"
              ? "bg-blue-600"
              : "bg-green-600"
          }`}
        >

          {mode === "login"
            ? "Login"
            : "Register"}

        </button>

        <p className="text-center text-sm">

          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <Link
            to={
              mode === "login"
                ? "/register"
                : "/login"
            }
            className="text-blue-400 ml-2"
          >

            {mode === "login"
              ? "Register"
              : "Login"}

          </Link>

        </p>

      </form>

    </div>
  );
};

export default Authentication;