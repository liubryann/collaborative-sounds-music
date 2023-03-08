import React from "react";
import styles from "./instrument-configs.module.scss";
import InstrumentSettings from "../InstrumentSettings";
import InstrumentNotes from "../InstrumentNotes";

interface InstrumentConfigsProps {
  partId: string;
}
export default function InstrumentConfigs({ partId }: InstrumentConfigsProps) {
  return (
    <div>
      <InstrumentSettings partId={partId} />
      <InstrumentNotes partId={partId} />
    </div>
  );
}
