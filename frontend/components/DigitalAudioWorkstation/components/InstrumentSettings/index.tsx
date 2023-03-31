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
import { AiFillSound, AiFillDelete } from "react-icons/ai";
import { IconContext } from "react-icons";
import Dropdown from "../../../Dropdown";
import RangeInput from "../RangeInput";

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
  const [oscillatorType, setOscillatorType] = useState<string>("");
  const [instrumentType, setInstrumentType] = useState<string>("");

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

  function handleSelectOscillatorType(oscillatorType: string) {
    updateInstrumentOscillator(partId, oscillatorType);
  }

  function handleSelectInstrumentType(instrumentType: string) {
    updateInstrumentType(partId, instrumentType);
  }

  return (
    <IconContext.Provider
      value={{ size: "0.8em", style: { opacity: "0.65", color: "#dbdbdb" } }}
    >
      <div
        className={`${styles.instrumentContainer} ${
          selectedPart ? styles.selectedInstrument : ""
        }`}
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
        <div className={styles.partIdContainer}>
          <div className={styles.partId}>{partId}</div>{" "}
          {selectedPart && (
            <button onClick={handleDeleteInstrument}>
              <AiFillDelete size={"1em"} />
            </button>
          )}
        </div>

        <div className={styles.volumeSlider}>
          <AiFillSound />
          <RangeInput
            min={"0"}
            max={"100"}
            value={volume}
            onChange={volumeSliderOnChange}
          />
        </div>
        {selectedPart && (
          <div>
            <Dropdown
              wrapperStyle={styles.dropdown}
              label={"Instrument"}
              selectedItem={instrumentType}
              handleSelectItem={handleSelectInstrumentType}
              items={instrumentTypes}
            />
            <Dropdown
              wrapperStyle={styles.dropdown}
              label={"Oscillator"}
              selectedItem={oscillatorType}
              handleSelectItem={handleSelectOscillatorType}
              items={oscillatorTypes}
            />
          </div>
        )}
      </div>
    </IconContext.Provider>
  );
}
