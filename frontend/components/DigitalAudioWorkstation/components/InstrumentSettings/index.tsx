import styles from "./instrument-settingd.module.scss";

import React from "react";

interface InstrumentSettingsProps {
  instrument: string;
}

export default function InstrumentSettings({
  instrument,
}: InstrumentSettingsProps) {
  return <div>{instrument}</div>;
}
