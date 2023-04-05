import React from "react";
import styles from "./composition-item.module.scss";
import { AiFillDelete } from "react-icons/ai";

interface CompositionItemProps {
  id: number;
  title: string;
  owner: string;
  updatedAt: string;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}

export default function CompositionItem({
  id,
  title,
  owner,
  updatedAt,
  handleDelete,
}: CompositionItemProps) {
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", { month: "short" });
  }
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{formatDate(updatedAt)}</div>
      </div>
      <button className={styles.delete} onClick={(e) => handleDelete(e, id)}>
        <AiFillDelete />
      </button>
    </div>
  );
}
