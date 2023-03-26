import React, { ReactNode } from "react";
import styles from "./card-container.module.scss";

interface CardContainerProps {
  children: ReactNode;
  clickHandler: () => void;
}
export default function CardContainer({
  children,
  clickHandler,
}: CardContainerProps) {
  return (
    <div className={styles.card} onClick={clickHandler}>
      {children}
    </div>
  );
}
