import React, { useState, useEffect, useMemo } from "react";
import styles from "./instrument-configs.module.scss";
import InstrumentSettings from "../InstrumentSettings";
import InstrumentNotes from "../InstrumentNotes";
import { Instrument } from "../../instruments";
import { instruments } from "../../instruments";
import { getInstrument, updateInstrumentVolume, Y } from "../../adapter";
import { schema } from "../../constants";
import debounce from "lodash.debounce";

interface InstrumentContainerProps {
  partId: string;
  openModal: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    partId: string,
    i: number,
    j: number
  ) => void;
}
export default function InstrumentContainer({
  partId,
  openModal,
}: InstrumentContainerProps) {
  const [instrument, setInstrument] = useState<Instrument>(() => {
    const yInstrument = getInstrument(partId);
    const yInstrumentName = yInstrument.get(schema.INSTRUMENT_NAME);
    const yVolume = yInstrument.get(schema.INSTRUMENT_VOLUME);
    return instruments[yInstrumentName](yVolume);
  });
  const [volume, setVolume] = useState<string>("5");

  function parseYInstrument(yInstrument: Y.Map<any>) {
    const yInstrumentName = yInstrument.get(schema.INSTRUMENT_NAME);
    const yVolume = yInstrument.get(schema.INSTRUMENT_VOLUME);
    setInstrument(instruments[yInstrumentName](yVolume));
    setVolume(yVolume);
  }

  useEffect(() => {
    const yInstrument = getInstrument(partId);
    parseYInstrument(yInstrument);

    yInstrument.observeDeep((e) => {
      parseYInstrument(getInstrument(partId));
    });
  }, [partId]);

  useEffect(() => {
    return () => {
      if (instrument) {
        instrument.dispose();
      }
    };
  }, [instrument]);

  const debouncedUpdateInstrumentVolume = useMemo(
    () => debounce(updateInstrumentVolume, 100),
    []
  );

  const volumeSliderOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    debouncedUpdateInstrumentVolume(partId, newVolume);
  };

  useEffect(() => {
    return () => {
      debouncedUpdateInstrumentVolume.cancel();
    };
  }, [debouncedUpdateInstrumentVolume]);

  return (
    <div className={styles.instrumentContainer}>
      <InstrumentSettings
        partId={partId}
        volume={volume}
        volumeSliderOnChange={volumeSliderOnChange}
      />
      {instrument && (
        <InstrumentNotes
          partId={partId}
          instrument={instrument}
          openModal={openModal}
        />
      )}
    </div>
  );
}
