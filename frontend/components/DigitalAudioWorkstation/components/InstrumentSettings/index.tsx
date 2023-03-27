import React, { useState, useEffect, useMemo } from "react";
import styles from "./instrument-configs.module.scss";
import {
  getInstrument,
  updateInstrumentVolume,
  Y,
  deletePart,
  updateInstrumentOscillator,
  updateInstrumentType,
} from "../../adapter";
import { oscillatorTypes, instrumentTypes } from "../../instruments";
import { schema } from "../../constants";
import debounce from "lodash.debounce";

interface InstrumentSettingsProps {
  partId: string;
  selectPart: (partId: string) => void;
  selectedPart: boolean;
  userColors: string[] | undefined;
}
export default function InstrumentSettings({
  partId,
  selectPart,
  selectedPart,
  userColors,
}: InstrumentSettingsProps) {
  const [volume, setVolume] = useState<string>("5");
  const [showOscillatorSettings, setShowOscillatorSettings] = useState(false);
  const [oscillatorType, setOscillatorType] = useState<string>("");
  const [instrumentType, setInstrumentType] = useState<string>("");
  const [showInstrumentTypes, setShowInstrumentTypes] = useState(false);

  function parseYInstrument(yInstrument: Y.Map<any>) {
    const yInstrumentType = yInstrument.get(schema.INSTRUMENT_TYPE);
    const yVolume = yInstrument.get(schema.INSTRUMENT_VOLUME);
    const yOscillator = yInstrument.get(schema.INSTRUMENT_OSCILLATOR);
    setInstrumentType(yInstrumentType);
    setVolume(yVolume);
    setOscillatorType(yOscillator);
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

  function openOscillatorMenu() {
    setShowOscillatorSettings(!showOscillatorSettings);
  }

  function handleSelectOscillatorType(oscillatorType: string) {
    setShowOscillatorSettings(false);
    updateInstrumentOscillator(partId, oscillatorType);
  }

  function openInstrumentTypesMenu() {
    setShowInstrumentTypes(!showInstrumentTypes);
  }

  function handleSelectInstrumentType(instrumentType: string) {
    setShowInstrumentTypes(false);
    updateInstrumentType(partId, instrumentType);
  }

  return (
    <div
      className={selectedPart ? styles.selectedInstrument : ""}
      onClick={() => selectPart(partId)}
    >
      <div className={styles.partsAwarenessContainer}>
        {userColors?.map((color) => (
          <div
            key={color}
            className={styles.partAwareness}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div>{partId}</div>
      <button onClick={handleDeleteInstrument}>x</button>
      <button onClick={openInstrumentTypesMenu}>{instrumentType}</button>
      <ul>
        {showInstrumentTypes &&
          instrumentTypes.map((instrumentType) => (
            <li key={instrumentType}>
              <button
                onClick={() => handleSelectInstrumentType(instrumentType)}
              >
                {instrumentType}
              </button>
            </li>
          ))}
      </ul>
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
      <button onClick={openOscillatorMenu}>{oscillatorType}</button>
      <ul>
        {showOscillatorSettings &&
          oscillatorTypes.map((oscillatorType) => (
            <li key={oscillatorType}>
              <button
                onClick={() => handleSelectOscillatorType(oscillatorType)}
              >
                {oscillatorType}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
