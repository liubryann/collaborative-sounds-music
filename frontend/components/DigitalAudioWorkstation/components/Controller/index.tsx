import React from "react";
import AddInstrument from "../AddInstrument";
import styles from "./controller.module.scss";
import * as Tone from "tone";

export default function Controller() {
  function onPlay() {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  }

  return (
    <div>
      <button onClick={onPlay}>play</button>
      <AddInstrument />
    </div>
  );
}
