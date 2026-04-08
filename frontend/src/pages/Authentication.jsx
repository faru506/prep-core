import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  useEffect(() => {

    setErrors({
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    });

    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    });

  }, [mode]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (mode === "register") {
      if (!passwordRegex.test(form.password)) {
        newErrors.password = "Password must be 8+ chars, include uppercase, lowercase, number & symbol";
      }
      if (form.first_name.length < 1) {
        newErrors.first_name = "First Name must be present";
      }
      if (form.last_name.length < 1) {
        newErrors.last_name = "Last Name must be present";
      }
    } else {
      if (form.password.length < 1) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let response;

      if (mode === "login") {
        response = await loginApi(form);
      } else {
        response = await registerApi(form);
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        alert("Authentication failed");
        return;
      }

      const token =
        response.headers?.get("Authorization");

      if (token) {
        saveToken(token);
      }

      navigate("/");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">

      <h1 className="text-3xl font-bold mb-10">
        {mode === "login"
          ? "Login to your account"
          : "Create your account"}
      </h1>

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {mode == "register" &&
            <div className="flex flex-row gap-4">

              <div>
                <label className="block text-sm mb-2 text-slate-300">
                  First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg 
                    bg-slate-800 border 
                    ${
                      errors.first_name
                        ? "border-red-500"
                        : "border-slate-700"
                    }
                    focus:outline-none focus:border-indigo-500`}
                />

                {errors.first_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-300">
                  Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg 
                    bg-slate-800 border 
                    ${
                      errors.last_name
                        ? "border-red-500"
                        : "border-slate-700"
                    }
                    focus:outline-none focus:border-indigo-500`}
                />

                {errors.last_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>



              

            </div>
          }

          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Email address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg 
                bg-slate-800 border 
                ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-700"
                }
                focus:outline-none focus:border-indigo-500`}
            />

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}

          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg 
                bg-slate-800 border 
                ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-700"
                }
                focus:outline-none focus:border-indigo-500`}
            />

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg 
                       bg-gradient-to-r 
                       from-indigo-500 
                       to-purple-500
                       hover:opacity-90
                       font-semibold transition"
          >

            {mode === "login"
              ? "Login"
              : "Register"}

          </button>

          <p className="text-center text-sm text-slate-400">

            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <Link
              to={
                mode === "login"
                  ? "/register"
                  : "/login"
              }
              className="ml-2 text-indigo-400 hover:text-indigo-300"
            >

              {mode === "login"
                ? "Register"
                : "Login"}

            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Authentication;