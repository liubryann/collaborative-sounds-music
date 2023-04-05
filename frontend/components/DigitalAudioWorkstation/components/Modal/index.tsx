import React, { useState, useRef } from "react";
import styles from "./modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  button: React.ReactNode;
  modalHeader?: React.ReactNode;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  setIsOpen,
  button,
  modalHeader,
  children,
}: ModalProps) {
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const modalRef = useRef<HTMLDivElement>(null);

  function handleClickOutside(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }

  return (
    <div>
      <button className={styles.button} onClick={toggleModal}>
        {button}
      </button>
      {isOpen && (
        <div className={styles.backdrop} onClick={handleClickOutside}>
          <div className={styles.modal} ref={modalRef}>
            {modalHeader && (
              <div className={styles.modalHeader}>{modalHeader}</div>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
