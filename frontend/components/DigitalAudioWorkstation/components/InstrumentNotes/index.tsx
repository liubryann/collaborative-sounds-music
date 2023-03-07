import React, { useEffect } from "react";
import styles from "./instrument-notes.module.scss";
import * as Tone from "tone";
import { instruments } from "../../instruments";
import { SynthOptions } from "tone";
import { updateSequence, updateNoteGrid, getNoteGrid } from "../../adapter";
import { connectAndSyncDoc } from "../../connection";

interface InstrumentNotesProps {
  instrumentName: string;
}

interface Note {
  time: string | number;
  note: Tone.Unit.Frequency;
  duration: string;
}

const octave = 1;
const bar = 0;
const gridLength = 4;

const notes = [`C${octave}`, `D${octave}`, `E${octave}`];

export default function InstrumentNotes({
  instrumentName,
}: InstrumentNotesProps) {
  //will probably need to add a # value in instrument. Or make instrument names unique.
  let defaultNoteGrid = getNoteGrid(`${instrumentName}`);
  if (!defaultNoteGrid) {
    defaultNoteGrid = [...Array(notes.length)].map((x) =>
      Array(gridLength).fill(false)
    );
  }

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridLength}, 1fr)`,
    gridTemplateRows: `repeat(${notes.length}, 1fr)`,
  };

  const defaultSequence: Note[] = [];
  for (let i = 0; i < gridLength; i++) {
    defaultSequence.push({
      time: `${bar}:${i}`,
      note: 0,
      duration: "4n",
    });
  }

  const [noteGrid, setNoteGrid] = React.useState(defaultNoteGrid);
  const [sequence, setSequence] = React.useState<Note[]>(defaultSequence);
  const [part, setPart] = React.useState<Tone.Part>();
  const [instrument, setInstrument] = React.useState<
    Tone.Synth<SynthOptions> | Tone.NoiseSynth
  >();

  useEffect(() => {
    setInstrument(instruments[instrumentName]());
  }, [instrumentName]);

  function toggleNoteCell(i: number, j: number) {
    let newNoteGrid = [...noteGrid];
    newNoteGrid[i][j] = !newNoteGrid[i][j];

    const newSequence = [...sequence];
    if (newNoteGrid[i][j]) {
      newSequence[j].note = notes[i];
    } else {
      newSequence[j].note = 0;
    }
    setSequence(newSequence);
    updateSequence("test", "test", newSequence);

    if (part) {
      part.dispose();
    }
    const newPart = new Tone.Part((time, value) => {
      if (!instrument) {
        console.log("error");
        return;
      }
      instrument.triggerAttackRelease(value.note, value.duration, time);
    }, newSequence).start(0);
    newPart.loop = true;
    setPart(newPart);

    updateNoteGrid(`${instrumentName}`, newNoteGrid);
    setNoteGrid(newNoteGrid);
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
