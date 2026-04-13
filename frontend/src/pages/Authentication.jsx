import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginApi, registerApi } from "../apis/authentication";
import { saveToken } from "../utilities/storage";

const Authentication = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.pathname === "/register" ? "register" : "login";

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
    setErrors({ first_name: "", last_name: "", email: "", password: "" });
    setForm({ first_name: "", last_name: "", email: "", password: "" });
  }, [mode]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
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
      if (form.first_name.length < 1) newErrors.first_name = "First Name is required";
      if (form.last_name.length < 1) newErrors.last_name = "Last Name is required";
    } else {
      if (form.password.length < 1) newErrors.password = "Password is required";
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
      const token = response.headers?.get("Authorization");
      if (token) {
        saveToken(token.replace("Bearer ", ""));
      }
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans">
      
      {/* --- STYLISH BACKGROUND --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
            {mode === "login" ? "Welcome" : "Join Us"}
          </h1>
          <p className="text-indigo-200/70 font-medium">
            {mode === "login" ? "Your journey begins here." : "Create your account in seconds."}
          </p>
        </div>

        {/* GLASS CARD - Hover: Border glows more intensely */}
        <div className="group/card backdrop-blur-2xl bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-white/30 hover:shadow-indigo-500/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {mode === "register" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest ml-2 mb-1 block transition-colors group-hover:text-white">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full px-4 py-3 rounded-2xl bg-white/5 border transition-all duration-300 outline-none text-white placeholder-slate-500
                      ${errors.first_name ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10 hover:border-indigo-400/50 hover:bg-white/10 focus:border-indigo-400 focus:bg-white/10"}`}
                  />
                  {errors.first_name && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.first_name}</p>}
                </div>

                <div className="relative group">
                  <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest ml-2 mb-1 block transition-colors group-hover:text-white">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full px-4 py-3 rounded-2xl bg-white/5 border transition-all duration-300 outline-none text-white placeholder-slate-500
                      ${errors.last_name ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10 hover:border-indigo-400/50 hover:bg-white/10 focus:border-indigo-400 focus:bg-white/10"}`}
                  />
                  {errors.last_name && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.last_name}</p>}
                </div>
              </div>
            )}

            <div className="relative group">
              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest ml-2 mb-1 block transition-colors group-hover:text-white">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className={`w-full px-4 py-3 rounded-2xl bg-white/5 border transition-all duration-300 outline-none text-white placeholder-slate-500
                  ${errors.email ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10 hover:border-indigo-400/50 hover:bg-white/10 focus:border-indigo-400 focus:bg-white/10"}`}
              />
              {errors.email && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.email}</p>}
            </div>

            <div className="relative group">
              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest ml-2 mb-1 block transition-colors group-hover:text-white">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-2xl bg-white/5 border transition-all duration-300 outline-none text-white placeholder-slate-500
                  ${errors.password ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10 hover:border-indigo-400/50 hover:bg-white/10 focus:border-indigo-400 focus:bg-white/10"}`}
              />
              {errors.password && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.password}</p>}
            </div>

            {/* BUTTON - Color Changing Gradient Shift */}
            <button
              type="submit"
              className="relative w-full group overflow-hidden py-4 rounded-2xl font-bold text-white transition-all duration-300 active:scale-95 shadow-xl"
            >
              {/* This gradient shifts and expands on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 
                              bg-[length:200%_100%] group-hover:bg-[length:100%_100%] 
                              transition-all duration-700 ease-in-out group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-indigo-500"></div>
              
              {/* Outer Glow that intensifies on hover */}
              <div className="absolute inset-0 shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_40px_rgba(192,38,211,0.6)] transition-all duration-500"></div>
              
              <span className="relative z-10 uppercase tracking-widest text-sm">
                {mode === "login" ? "Sign In" : "Create Account"}
              </span>
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-400">
                {mode === "login" ? "New here?" : "Already a member?"}
                <Link
                  to={mode === "login" ? "/register" : "/login"}
                  className="ml-2 text-white font-bold hover:text-indigo-300 transition-all duration-300 underline underline-offset-4 decoration-indigo-500/50 hover:decoration-indigo-300"
                >
                  {mode === "login" ? "Create account" : "Login here"}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
