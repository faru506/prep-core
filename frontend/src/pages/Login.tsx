import { useState, ChangeEvent, FormEvent } from "react";

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: ""
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost:3000/api/v1/auth/sign_in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: form })
      }
    );

    const data = await res.json();

    if (res.ok) {

      const token =
        res.headers.get("Authorization");

      if (token) {
        localStorage.setItem("token", token);
      }

      alert("Login successful 🎉");

      window.location.href = "/";

    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        /><br /><br />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;