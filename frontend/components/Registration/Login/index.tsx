import styles from "../registration.module.scss";
import React, { useState } from "react";
import { login } from "@/services/api-service";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password)
      .then(() => {
        router.push("/dashboard");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className={styles["registration-container"]}>
      <div className={styles["registration-card"]}>
        <p className={styles["error-msg"]}>{error}</p>
        <form onSubmit={handleLogin} className={styles["registration-form"]}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <div>or</div>
        <Link href="/signup">Sign up</Link>
      </div>
    </div>
  );
}
