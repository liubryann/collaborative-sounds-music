import React from "react";
import styles from "./instrument-configs.module.scss";
import InstrumentSettings from "../InstrumentSettings";
import InstrumentNotes from "../InstrumentNotes";

interface InstrumentConfigsProps {
  instrumentName: string;
}
export default function InstrumentConfigs({
  instrumentName,
}: InstrumentConfigsProps) {
  return (
    <div>
      <InstrumentSettings instrument={instrumentName} />
      <InstrumentNotes instrumentName={instrumentName} />
    </div>
  );
}
