import styles from "./instrument-settingd.module.scss";

import React from "react";
import { deletePart } from "../../adapter";

interface InstrumentSettingsProps {
  partId: string;
}

export default function InstrumentSettings({
  partId,
}: InstrumentSettingsProps) {
  function handleDeleteInstrument() {
    deletePart(partId);
  }
  return (
    <div>
      {partId}
      <button onClick={handleDeleteInstrument}>x</button>
    </div>
  );
}
