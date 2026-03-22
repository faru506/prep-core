import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

interface SignupForm {
  email: string;
  password: string;
  username: string;
  name: string;
}

function Signup() {
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    username: "",
    name: ""
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
      "http://localhost:3000/api/v1/auth/sign_up",
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
      alert("Signup successful 🎉");
      window.location.href = "/login";
    } else {
      alert(data.errors?.join(", ") || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        /><br /><br />

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        /><br /><br />

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
          Signup
        </button>

      </form>
    </div>
  );
}

export default Signup;