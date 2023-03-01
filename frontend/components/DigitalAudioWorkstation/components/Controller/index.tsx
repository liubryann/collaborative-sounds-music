import React from "react";
import AddInstrument from "../AddInstrument";
import styles from "./controller.module.scss";

interface ControllerProps {
  onPlay: () => void;
  onPause: () => void;
  availableInstruments: string[];
}

export default function Controller({
  onPlay,
  onPause,
  availableInstruments,
}: ControllerProps) {
  return (
    <div>
      <button onClick={onPlay}>play</button>
      <button onClick={onPause}>pause</button>
      <AddInstrument availableInstruments={availableInstruments} />
    </div>
  );
}
