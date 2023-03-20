import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  };

  const [noteGrid, setNoteGrid] = useState<(string | null)[][]>(
    getNoteGrid(partId).toArray()
  );

  useEffect(() => {
    const yNoteGrid = getNoteGrid(partId);

    setNoteGrid(yNoteGrid.toArray());

    yNoteGrid.observeDeep(() => {
      setNoteGrid(getNoteGrid(partId).toArray());
    });
  }, [partId]);

  const clickNoteCell = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      i: number,
      j: number
    ) => {
      if (e.button === 2) {
        openModal(e, partId, i, j); // todo
      } else if (e.button === 0) {
        if (noteGrid[j][i]) {
          updateNoteGridAndSequence(partId, i, j, baseNoteLength, false);
        } else {
          const baseNote = noteGrid[j].find((note) => note !== null) || "4n";
          updateNoteGridAndSequence(partId, i, j, baseNote, true); // change this value to change the default note length on click
        }
      }
    },
    [noteGrid, partId, openModal]
  );

  const renderNoteGrid = useMemo(() => {
    const grid = [];
    for (let i = 0; i < notes.length; i++) {
      const row = [];
      for (let j = 0; j < gridLength; j++) {
        row.push(
          <button
            onClick={(e) => clickNoteCell(e, i, j)}
            onContextMenu={(e) => clickNoteCell(e, i, j)}
            key={`${j}-${i}`}
            className={`${styles.cell} ${
              noteGrid[j][i] && styles.selectedCell
            }`}
          >
            {noteGrid[j][i]}
          </button>
        );
      }
      grid.push(row);
    }
    return grid;
  }, [noteGrid, clickNoteCell]);

  const renderBarNumbers = () => {
    const barNumbers = Array.from(Array(gridLength + 1).keys()).map((i) => (
      <div className={styles.header} key={i}>
        {i}
      </div>
    ));
    barNumbers[0] = (
      <div className={styles.header} key={0}>
        {}
      </div>
    );

    return barNumbers;
  };

  return (
    <div className={styles.container2}>
      <div className={styles.container}>
        <div className={styles.noteLabels}>
          {notes.map((note) => {
            return (
              <div key={note} className={styles.note}>
                {note}
              </div>
            );
          })}
        </div>
        <div className={styles.barNumberLabels}>{renderBarNumbers()}</div>
        <div style={gridContainerStyle} className={styles.gridContainer}>
          {renderNoteGrid}
        </div>
      </div>
    </div>
  );
}
