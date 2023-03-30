import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "@/styles/landing.module.scss";

export default function Landing() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const renderButton = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    } else if (user) {
      router.push("/dashboard");
    } else if (error) {
      return <p>{error.message}</p>;
    } else {
      return (
        <button
          className={styles["registration-button"]}
          onClick={() => router.push("/api/auth/login")}
        >
          Log in and Sign up
        </button>
      );
    }
  };

  return (
    <div className={styles["centre-container"]}>
      <div className={styles["registration-card"]}>
        <h3>Compose something beautiful</h3>
        {renderButton()}
      </div>
    </div>
  );
}
