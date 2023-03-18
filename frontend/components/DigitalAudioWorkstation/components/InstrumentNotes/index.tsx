import React, { useEffect, useState } from "react";
import styles from "./instrument-notes.module.scss";
import { gridLength, notes, baseNoteLength } from "../../instruments";
import { getNoteGrid, updateNoteGridAndSequence } from "../../adapter";

interface InstrumentNotesProps {
  partId: string;
  openModal: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    partId: string,
    i: number,
    j: number
  ) => void;
}

export default function InstrumentNotes({
  partId,
  openModal,
}: InstrumentNotesProps) {
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridLength}, 70px)`,
    gridTemplateRows: `repeat(${notes.length}, 1fr)`,
    flex: 1,
    overflow: "scroll",
    // maxWidth: "100%",
  };
  const noteColumnStyle = {
    display: "grid",
    gridTemplateRows: `repeat(${notes.length}, 1fr)`,
  };

  const [noteGrid, setNoteGrid] = useState<boolean[][]>(
    getNoteGrid(partId).toArray()
  );

  useEffect(() => {
    const yNoteGrid = getNoteGrid(partId);
    setNoteGrid(yNoteGrid.toArray());

    yNoteGrid.observeDeep(() => {
      setNoteGrid(getNoteGrid(partId).toArray());
    });
  }, [partId]);

  function clickNoteCell(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    i: number,
    j: number
  ) {
    if (e.button === 2) {
      openModal(e, partId, i, j);
    } else if (e.button === 0) {
      if (noteGrid[i][j]) {
        updateNoteGridAndSequence(partId, i, j, baseNoteLength, false);
      } else {
        updateNoteGridAndSequence(partId, i, j, "4n", true); // change this value to change the default note length on click
      }
    }
  }

  return (
    <div className={styles.container}>
      <div style={noteColumnStyle}>
        {notes.map((note) => {
          return (
            <div key={note} className={styles.note}>
              {note}
            </div>
          );
        })}
      </div>
      <div style={gridContainerStyle} className={styles.gridContainer}>
        {noteGrid.map((row, i) => {
          return row.map((cell, j) => {
            return (
              <button
                onClick={(e) => clickNoteCell(e, i, j)}
                onContextMenu={(e) => clickNoteCell(e, i, j)}
                key={j}
                className={`${styles.cell} ${
                  noteGrid[i][j] && styles.selectedCell
                }`}
              >
                {noteGrid[i][j]}
              </button>
            );
          });
        })}
      </div>
    </div>
  );
}
