import React, { useEffect, useState } from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import InstrumentContainer from "./components/InstrumentContainer";
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
    <div>
      {parts.map((partId) => {
        return <InstrumentContainer key={partId} partId={partId} />;
      })}
      <Controller />
    </div>
  );
}
