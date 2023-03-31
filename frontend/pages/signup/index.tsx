import Signup from "@/components/Registration/Signup";
import React from "react";
import styles from "@/styles/registration.module.scss";

export default function SignupPage() {
  return (
    <div className={styles["split"]}>
      <div className={styles["left"]}>
        <h2>Begin your musical journey</h2>
      </div>
      <div className={styles["right"]}>
        <Signup />
      </div>
    </div>
  );
}
