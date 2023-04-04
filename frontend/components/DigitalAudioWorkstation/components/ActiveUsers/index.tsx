import React from "react";
import { UserAwareness } from "../../awarenessHelper";
import styles from "./active-users.module.scss";

interface ActiveUsersProps {
  activeUsers: UserAwareness[];
}

export default function ActiveUsers({ activeUsers }: ActiveUsersProps) {
  return (
    <div className={styles.container}>
      {activeUsers.map((user, index) => {
        return (
          <div
            className={styles.activeUser}
            key={index}
            style={{ backgroundColor: user.color }}
          >
            {user.username}
          </div>
        );
      })}
    </div>
  );
}
