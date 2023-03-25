import { signup } from "@/services/api-service";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const defaultInputs = {
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  };

  const [inputs, setInputs] = useState(defaultInputs);

  const setField = (field: string, value: string) => {
    setInputs({
      ...inputs,
      [field]: value,
    });
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, firstname, lastname, username, password } = inputs;
    signup(email, firstname, lastname, username, password)
      .then(() => {
        router.push("/dashboard");
      })
      .catch((err) => {
        const errorMsg = document.getElementById("signup-error-msg")!;
        errorMsg.innerHTML = err.message;
      })
      .finally(() => {
        setInputs(defaultInputs);
      });
  };

  return (
    <div>
      <p id="signup-error-msg"></p>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={inputs.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={inputs.firstname}
          onChange={(e) => setField("firstname", e.target.value)}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={inputs.lastname}
          onChange={(e) => setField("lastname", e.target.value)}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={inputs.username}
          onChange={(e) => setField("username", e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={inputs.password}
          onChange={(e) => setField("password", e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
