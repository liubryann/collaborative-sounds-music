import styles from "../registration.module.scss";
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
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message);
      })
      .finally(() => {
        setInputs(defaultInputs);
      });
  };

  return (
    <div className={styles["registration-container"]}>
      <div className={styles["registration-card"]}>
        <div>Begin your musical journey. Together.</div>
        <p className={styles["error-msg"]}>{error}</p>
        <form onSubmit={handleSignup} className={styles["registration-form"]}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={inputs.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            autoComplete="given-name"
            value={inputs.firstname}
            onChange={(e) => setField("firstname", e.target.value)}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            autoComplete="family-name"
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
    </div>
  );
}
