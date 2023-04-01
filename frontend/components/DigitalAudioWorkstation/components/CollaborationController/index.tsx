import React, { useEffect, useState } from "react";
import { FaGlobeAmericas } from "react-icons/fa";
import styles from "./share.module.scss";
import { IconContext } from "react-icons";
import CollaborationModal from "../CollaborationModal";

interface CollaborationControllerProps {
  roomId: string;
}

export default function CollaborationController({
  roomId,
}: CollaborationControllerProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <IconContext.Provider value={{ size: "1em", style: { color: "#1377b9" } }}>
      <button className={styles.shareButton} onClick={() => setIsOpen(true)}>
        <FaGlobeAmericas />
        <span>Share</span>
      </button>
      {isOpen && <CollaborationModal setIsOpen={setIsOpen} roomId={roomId} />}
    </IconContext.Provider>
  );
}
