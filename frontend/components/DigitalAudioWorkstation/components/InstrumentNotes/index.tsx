import React, { useEffect, useState, useCallback } from "react";
import styles from "./instrument-notes.module.scss";
import * as Tone from "tone";
import { instruments, gridLength, notes, Note } from "../../instruments";
import { SynthOptions } from "tone";
import {
  getNoteGrid,
  updateNoteGridAndSequence,
  getSequence,
  getInstrument,
} from "../../adapter";

interface InstrumentNotesProps {
  partId: string;
}

export default function InstrumentNotes({ partId }: InstrumentNotesProps) {
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
  const [instrument, setInstrument] = useState<
    Tone.Synth<SynthOptions> | Tone.NoiseSynth
  >();

  const createNewPart = useCallback(() => {
    // if (part) {
    //   part.dispose();
    // }
    const newPart = new Tone.Part((time, value) => {
      if (!instrument) {
        console.log("error");
        return;
      }
      instrument.triggerAttackRelease(value.note, value.duration, time);
    }, sequence).start(0);
    newPart.loop = true;
    // setPart(newPart);
  }, [instrument, sequence]);

  useEffect(() => {
    const yNoteGrid = getNoteGrid(partId);
    const yInstrument = getInstrument(partId);
    setInstrument(instruments[yInstrument]());

    yNoteGrid.observeDeep(() => {
      setNoteGrid(getNoteGrid(partId).toArray());
      setSequence(getSequence(partId).toArray());
    });
  }, [partId]);

  useEffect(() => {
    return () => {
      if (part) {
        part.dispose();
      }
      if (instrument) {
        instrument.dispose();
      }
    };
  }, [part, instrument]);

  useEffect(() => {
    createNewPart();
  }, [sequence, createNewPart]);

  function toggleNoteCell(i: number, j: number) {
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
