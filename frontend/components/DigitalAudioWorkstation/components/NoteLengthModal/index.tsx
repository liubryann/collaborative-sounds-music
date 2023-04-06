import React, { useState } from "react";
import styles from "./note-length-modal.module.scss";

interface NoteLengthModalProps {
  position: { x: number; y: number };
  selectNoteLength: (duration: string) => void;
}

const noteLengths = [
  "1m",
  "2n.",
  "2n",
  "4n.",
  "4n",
  "8n.",
  "8n",
  "16n.",
  "16n",
];

export default function NoteLengthModal({
  position,
  selectNoteLength,
}: NoteLengthModalProps) {
  const modalStyle = {
    position: "absolute",
    top: position.y,
    left: position.x,
  };

  return (
    // @ts-ignore
    <div className={styles.noteLengthModalContainer} style={modalStyle}>
      <ul>
        {noteLengths.map((noteLength) => {
          return (
            <li key={noteLength}>
              <button onClick={() => selectNoteLength(noteLength)}>
                {noteLength}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
