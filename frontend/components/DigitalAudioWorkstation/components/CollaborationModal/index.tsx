import React from "react";
import styles from "./collaborationmodal.module.scss";
import { RiCloseLine } from "react-icons/ri";
import { shareComposition } from "@/services/api-service";

interface CollaborationModalProps {
  setIsOpen: (isOpen: boolean) => void;
  roomId: string;
}

const CollaborationModal = ({ setIsOpen, roomId }: CollaborationModalProps) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    shareComposition(roomId, e.target.email.value).then((res) => {
      console.log(res);
    });
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Share Composition</h5>
          </div>
          <div className={styles.modalContent}>
            Enter the e-mail of the user you wish to collaborate with on this
            composition.
          </div>
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <input
              type="text"
              name="email"
              className={styles.formInput}
            ></input>
            <div className={styles.actionsContainer}>
              <button type="submit" className={styles.btn}>
                Share
              </button>
              <button className={styles.btn} onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CollaborationModal;
