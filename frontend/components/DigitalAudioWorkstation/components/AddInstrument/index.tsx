import React from "react";
import styles from "./add-instrument.module.scss";
import { addPart } from "../../adapter";
import * as Tone from "tone";

export default function AddInstrument() {
  function handleAddInstrument(instrument: string) {
    const partName = prompt("Enter the name of this part");
    if (partName !== null) {
      Tone.Transport.stop();
      addPart(instrument, partName);
    }
  }

  return (
    <div>
      <button onClick={() => handleAddInstrument("Synth")}>
        Add Instrument
      </button>
    </div>
  );
}
