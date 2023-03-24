import { signup } from "@/services/api-service";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup().then((res) => {
      setUsername("");
      setPassword("");
      e.currentTarget.reset();
      if (res.status === 200) {
        router.push("/dashboard");
      } else {
        const errorMsg = document.getElementById("error-msg")!;
        errorMsg.innerHTML = "Invalid username or password";
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
