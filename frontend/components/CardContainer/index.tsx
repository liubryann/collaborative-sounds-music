import React, { ReactNode } from "react";
import styles from "./card-container.module.scss";

interface CardContainerProps {
  children: ReactNode;
  handleClick: () => void;
}
export default function CardContainer({
  children,
  handleClick,
}: CardContainerProps) {
  return (
    <div className={styles.card} onClick={handleClick}>
      {children}
    </div>
  );
}
