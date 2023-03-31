import React, { useEffect, useState } from "react";
import { SiStyleshare } from "react-icons/si";
import styles from "./share.module.scss";
import { IconContext } from "react-icons";
import { shareComposition } from "@/services/api-service";

export default function CollaborationController(roomId) {

  const selectCollaborators = (e) => {
    e.preventDefault();
    let temp = prompt("Enter email of user you want to share with.")
    shareComposition(roomId.roomId, temp!).then((res) => {
      console.log(res);
    })
  }
  return (<IconContext.Provider value={{ size: "2em", style: { color: "#85C7F2" } }}>
    <div>
      <button
        className={styles.shareButton}
        onClick={selectCollaborators}
      >
        <SiStyleshare />
      </button>
    </div>
  </IconContext.Provider>)
}
