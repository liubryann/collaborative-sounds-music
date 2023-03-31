import Login from "@/components/Registration/Login";
import styles from "@/styles/registration.module.scss";

export default function Landing() {
  return (
    <div className={styles["split"]}>
      <div className={styles["left"]}>
        <h2>Compose something beautiful</h2>
      </div>
      <div className={styles["right"]}>
        <Login />
      </div>
    </div>
  );
}
