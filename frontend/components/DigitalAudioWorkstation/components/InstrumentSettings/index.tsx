import styles from "./instrument-settings.module.scss";
import React from "react";
import { deletePart } from "../../adapter";

interface InstrumentSettingsProps {
  partId: string;
  volume: string;
  volumeSliderOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InstrumentSettings({
  partId,
  volume,
  volumeSliderOnChange,
}: InstrumentSettingsProps) {
  function handleDeleteInstrument() {
    deletePart(partId);
  }

  return (
    <div className={styles.instrumentSettingsContainer}>
      {partId}
      <button onClick={handleDeleteInstrument}>x</button>
      <div className={styles.volumeSlider}>
        Volume
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={volumeSliderOnChange}
        />
        {volume}
      </div>
    </div>
  );
}
