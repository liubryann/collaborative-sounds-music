import React, { useEffect } from "react";
import styles from "./add-instrument.module.scss";
import { useCompositionDispatch } from "@/contexts/CompositionContext";

interface AddInstrumentProps {
  availableInstruments: string[];
}

export default function AddInstrument({
  availableInstruments,
}: AddInstrumentProps) {
  const [openInstrumentsPanel, setOpenInstrumentsPanel] = React.useState(false);

  const dispatch = useCompositionDispatch();

  function toggleInstrumentsPanel() {
    setOpenInstrumentsPanel(!openInstrumentsPanel);
  }

  function addInstrument(instrument: string) {
    dispatch({ type: "addInstrument", payload: { instrument } });
  }

  return (
    <div>
      <button onClick={toggleInstrumentsPanel}>Add Instrument</button>
      {openInstrumentsPanel && (
        <div>
          {availableInstruments.map((instrument) => {
            return (
              <div key={instrument} onClick={() => addInstrument(instrument)}>
                {instrument}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
