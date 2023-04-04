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
    mailing: false,
  };
  const [inputs, setInputs] = useState(defaultInputs);
  const [error, setError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  const setField = (field: string, value: any) => {
    setInputs({
      ...inputs,
      [field]: value,
    });
  };

  const agreeCheck = (value: boolean) => {
    setAgree(!agree);
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agree) {
      setError("Must agree to terms of service");
      return;
    }
    const { email, firstname, lastname, username, password, mailing } = inputs;
    signup(email, firstname, lastname, username, password, mailing)
      .then(() => {
        router.push("/dashboard");
        setInputs(defaultInputs);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className={styles["registration-container"]}>
      <div className={styles["registration-card"]}>
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
          <label>
            <input
              type="checkbox"
              checked={inputs.mailing}
              onChange={(e) => setField("mailing", e.target.checked)}
            />
            Agree to join our mailing list. Optional
          </label>
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => agreeCheck(e.target.checked)}
            />
            Agree to our Terms of Service. Required
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}
