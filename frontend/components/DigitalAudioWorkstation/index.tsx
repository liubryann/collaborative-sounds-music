import React from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import { useComposition } from "@/contexts/CompositionContext";
import InstrumentConfigs from "./components/InstrumentConfigs";

export default function DigitalAudioWorkstation() {
  const composition = useComposition();

  return (
    <div className={styles.test}>
      {composition?.instruments.map((instrumentName, i) => {
        return <InstrumentConfigs key={i} instrumentName={instrumentName} />;
      })}
      <Controller />
    </div>
  );
}
