import React, { useEffect, useState } from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import InstrumentConfigs from "./components/InstrumentConfigs";
import AudioExport from "./components/AudioFile/AudioExport";
import { connectAndSyncDoc } from "./connection";
import { getParts } from "./adapter";

export default function DigitalAudioWorkstation() {
  const [parts, setParts] = useState<string[]>([]);

  useEffect(() => {
    connectAndSyncDoc("test");
    const yInstruments = getParts();
    yInstruments.observe((event) => {
      setParts([...getParts()]);
    });
  }, []);

  return (
    <div className={styles.test}>
      {parts.map((partId) => {
        return <InstrumentConfigs key={partId} partId={partId} />;
      })}
      <Controller />
      <AudioExport />
    </div>
  );
}
