import React, { useEffect, useState, useCallback } from "react";
import styles from "./instrument-notes.module.scss";
import * as Tone from "tone";
import { gridLength, notes, Note, Instrument } from "../../instruments";
import {
  getNoteGrid,
  updateNoteGridAndSequence,
  getSequence,
} from "../../adapter";

interface InstrumentNotesProps {
  partId: string;
  instrument: Instrument;
}

export default function InstrumentNotes({
  partId,
  instrument,
}: InstrumentNotesProps) {
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridLength}, 1fr)`,
    gridTemplateRows: `repeat(${notes.length}, 1fr)`,
  };

  const [noteGrid, setNoteGrid] = useState<boolean[][]>(
    getNoteGrid(partId).toArray()
  );
  const [sequence, setSequence] = useState<Note[]>(
    getSequence(partId).toArray()
  );
  const [part, setPart] = useState<Tone.Part>();

  const createNewPart = useCallback(() => {
    if (!instrument) {
      console.log("error"); // TODO: this shows up but doesn't affect functionality
      return;
    }
    const newPart = new Tone.Part((time, value) => {
      instrument.triggerAttackRelease(value.note, value.duration, time);
    }, sequence).start(0);
    newPart.loop = true;

    return newPart;
  }, [instrument, sequence]);

  useEffect(() => {
    const yNoteGrid = getNoteGrid(partId);

    yNoteGrid.observeDeep(() => {
      setNoteGrid(getNoteGrid(partId).toArray());
      setSequence(getSequence(partId).toArray());
    });
  }, [partId]);

  useEffect(() => {
    setPart(createNewPart());
  }, [createNewPart]);

  useEffect(() => {
    return () => {
      if (part) {
        part.dispose();
      }
    };
  }, [part]);

  function toggleNoteCell(i: number, j: number) {
    if (part) {
      part.dispose();
    }
    updateNoteGridAndSequence(partId, i, j);
  }

  return (
    <div>
      <div style={gridContainerStyle}>
        {noteGrid.map((row, i) => {
          return row.map((cell, j) => {
            return (
              <button
                onClick={() => toggleNoteCell(i, j)}
                key={j}
                className={`${styles.cell} ${
                  noteGrid[i][j] && styles.selectedCell
                }`}
              >
                {cell}
              </button>
            );
          });
        })}
      </div>
    </div>
  );
}
