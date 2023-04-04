import React from "react";
import styles from "./add-instrument.module.scss";
import { addPart } from "../../adapter";
import * as Tone from "tone";

interface AddInstrumentProps {
  pause: () => void;
}

export default function AddInstrument({ pause }: AddInstrumentProps) {
  function handleAddInstrument(instrument: string) {
    const partName = prompt("Enter the name of this part");
    if (partName !== null) {
      pause();
      addPart(instrument, partName);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={() => handleAddInstrument("Synth")}>
        Add Instrument
      </button>
    </div>
  );
}
