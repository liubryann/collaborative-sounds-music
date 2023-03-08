import React from "react";
import styles from "./add-instrument.module.scss";
import { instrumentNames } from "../../instruments";
import { addPart } from "../../adapter";

export default function AddInstrument() {
  const [openInstrumentsPanel, setOpenInstrumentsPanel] = React.useState(false);

  function toggleInstrumentsPanel() {
    setOpenInstrumentsPanel(!openInstrumentsPanel);
  }

  function handleAddInstrument(instrument: string) {
    const partName = prompt("Enter the name of this part");
    if (partName !== null) {
      addPart(instrument, partName);
    }
  }

  return (
    <div>
      <button onClick={toggleInstrumentsPanel}>Add Instrument</button>
      {openInstrumentsPanel && (
        <div>
          {instrumentNames.map((instrument) => {
            return (
              <div
                key={instrument}
                onClick={() => handleAddInstrument(instrument)}
              >
                {instrument}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
