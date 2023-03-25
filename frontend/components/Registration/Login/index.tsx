import React, { useState } from "react";
import { login } from "@/services/api-service";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password)
      .then(() => {
        router.push("/dashboard");
      })
      .catch((err) => {
        const errorMsg = document.getElementById("login-error-msg")!;
        errorMsg.innerHTML = err.message;
      })
      .finally(() => {
        setUsername("");
        setPassword("");
      });
  };

  return (
    <div>
      <p id="login-error-msg"></p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <Link href="/signup">Sign Up</Link>
    </div>
  );
}
