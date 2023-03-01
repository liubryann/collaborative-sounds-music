import React from "react";
import styles from "./instrument-configs.module.scss";

interface InstrumentConfigsProps {
  instrument: string;
}
export default function InstrumentConfigs({
  instrument,
}: InstrumentConfigsProps) {
  return <div>{instrument}</div>;
}
