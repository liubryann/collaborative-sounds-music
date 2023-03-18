import React, { useState, useEffect, useMemo } from "react";
import styles from "./instrument-configs.module.scss";
import {
  getInstrument,
  updateInstrumentVolume,
  Y,
  deletePart,
} from "../../adapter";
import { schema } from "../../constants";
import debounce from "lodash.debounce";

interface InstrumentSettingsProps {
  partId: string;
  selectPart: (partId: string) => void;
  selectedPart: boolean;
}
export default function InstrumentSettings({
  partId,
  selectPart,
  selectedPart,
}: InstrumentSettingsProps) {
  const [volume, setVolume] = useState<string>("5");

  function parseYInstrument(yInstrument: Y.Map<any>) {
    const yVolume = yInstrument.get(schema.INSTRUMENT_VOLUME);
    setVolume(yVolume);
  }

  useEffect(() => {
    const yInstrument = getInstrument(partId);
    parseYInstrument(yInstrument);

    yInstrument.observeDeep((e) => {
      parseYInstrument(getInstrument(partId));
    });
  }, [partId]);

  const debouncedUpdateInstrumentVolume = useMemo(
    () => debounce(updateInstrumentVolume, 100),
    []
  );

  const volumeSliderOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    debouncedUpdateInstrumentVolume(partId, newVolume);
  };

  function handleDeleteInstrument() {
    deletePart(partId);
  }

  useEffect(() => {
    return () => {
      debouncedUpdateInstrumentVolume.cancel();
    };
  }, [debouncedUpdateInstrumentVolume]);

  return (
    <div
      className={selectedPart ? styles.selectedInstrument : ""}
      onClick={() => selectPart(partId)}
    >
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
      </div>
    </div>
  );
}
