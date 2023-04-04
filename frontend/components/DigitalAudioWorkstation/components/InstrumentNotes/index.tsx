import React, { useEffect, useState, useMemo, useCallback } from "react";
import styles from "./instrument-notes.module.scss";
import {
  gridLength,
  notes,
  baseNoteLength,
  getDefaultSequence,
  loopEnd,
} from "../../instruments";
import { getNoteGrid, updateNoteGridAndSequence } from "../../adapter";
import * as Tone from "tone";

interface InstrumentNotesProps {
  partId: string;
  openModal: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    partId: string,
    i: number,
    j: number
  ) => void;
  selectedCellAwareness: any;
  setSelectedCellAwareness: any;
}

export default function InstrumentNotes({
  partId,
  openModal,
  selectedCellAwareness,
  setSelectedCellAwareness,
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
      setSelectedCellAwareness(partId, i, j);
    },
    [noteGrid, partId, openModal, setSelectedCellAwareness]
  );

  const renderNoteGrid = useMemo(() => {
    const getCellBorderColor = (i: number, j: number) => {
      if (!selectedCellAwareness) {
        return "";
      }
      const index = [i, j].toString();
      return selectedCellAwareness[index]
        ? `2px solid ${selectedCellAwareness[index]}`
        : "";
    };

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
            style={{
              border: getCellBorderColor(i, j),
            }}
          >
            {noteGrid[j][i]}
          </button>
        );
      }
      grid.push(row);
    }
    return grid;
  }, [noteGrid, clickNoteCell, selectedCellAwareness]);

  const renderBarNumbers = () => {
    const barNumbers = Array.from(Array(gridLength + 1).keys()).map((i) => (
      <div
        className={`${styles.header} ${
          currentBar === i ? styles.highlight : ""
        }`}
        key={i}
      >
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

  const [currentBar, setCurrentBar] = useState(0);

  // TODO: Experimental
  useEffect(() => {
    const seq = getDefaultSequence();
    const drawPart = new Tone.Part((time, value) => {
      Tone.Draw.schedule(() => {
        const t = Tone.Transport.position.toString();
        const [bar, beat, sixteenth] = t.split(".")[0].split(":");
        const index =
          (parseInt(bar) % 2) * 16 +
          parseInt(beat) * 4 +
          parseInt(sixteenth) +
          1;
        setCurrentBar(index);
      }, time);
    }, seq).start(0);
    drawPart.loopStart = 0;
    drawPart.loopEnd = loopEnd;
    drawPart.loop = true;

    return () => {
      drawPart.dispose();
    };
  }, []);

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
