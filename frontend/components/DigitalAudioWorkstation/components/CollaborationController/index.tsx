import React, { useEffect, useState } from "react";
import { SiStyleshare } from "react-icons/si";
import styles from "./share.module.scss";
import { IconContext } from "react-icons";
import CollaborationModal from "../CollaborationModal";

export default function CollaborationController(roomId) {
  const [isOpen, setIsOpen] = useState(false);
  return (<IconContext.Provider value={{ size: "2em", style: { color: "#85C7F2" } }}>
    <div>
      <button
        className={styles.shareButton}
        onClick={() => setIsOpen(true)}
      >
        <SiStyleshare />
      </button>
      {isOpen && <CollaborationModal setIsOpen={setIsOpen} roomId={roomId} />}
    </div>
  </IconContext.Provider>)
}
