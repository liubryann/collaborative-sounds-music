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
    login(username, password).then((res) => {
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
      <p id="error-msg"></p>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <Link href="/signup">Sign Up</Link>
    </div>
  );
}
