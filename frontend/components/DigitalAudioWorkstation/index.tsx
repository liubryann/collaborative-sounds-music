import React, { useEffect, useState } from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import { useComposition } from "@/contexts/CompositionContext";
import InstrumentConfigs from "./components/InstrumentConfigs";
import { connectAndSyncDoc } from "./connection";
import { getComposition } from "./adapter";

export default function DigitalAudioWorkstation() {
  const composition = useComposition();

  useEffect(() => {
    connectAndSyncDoc("test");
  }, []);

  return (
    <div className={styles.test}>
      {composition?.instruments.map((instrumentName, i) => {
        return <InstrumentConfigs key={i} instrumentName={instrumentName} />;
      })}
      <Controller />
    </div>
  );
}
