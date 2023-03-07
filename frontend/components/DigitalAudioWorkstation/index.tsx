import React from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import { useComposition } from "@/contexts/CompositionContext";
import InstrumentConfigs from "./components/InstrumentConfigs";
import { connectAndSyncDoc } from "./connection";

export default function DigitalAudioWorkstation() {
  const composition = useComposition();

  // when the page loads, call adapter.init()
  React.useEffect(() => {
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
