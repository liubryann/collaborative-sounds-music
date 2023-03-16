import React, { useState, useEffect } from "react";
import AddInstrument from "../AddInstrument";
import styles from "./controller.module.scss";
import * as Tone from "tone";
import { getBpm, updateBpm } from "../../adapter";
import { defaultBpm } from "../../instruments";

export default function Controller() {
  const [bpm, setBpm] = useState(defaultBpm.toString());

  useEffect(() => {
    const yBpm = getBpm();
    setBpm(yBpm.toString());
    Tone.Transport.bpm.value = +yBpm.toString();

    yBpm.observe((e) => {
      const newBpm = e.target.toString();
      setBpm(newBpm);
      Tone.Transport.bpm.value = +newBpm;
    });
  }, []);

  function handleBpmChange(e: React.ChangeEvent<HTMLInputElement>) {
    const bpm = e.target.value;
    updateBpm(bpm);
  }

  function onPlay() {
    if (Tone.Transport.state !== "started") {
      Tone.start();
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  }

  return (
    <div>
      <button onClick={onPlay}>play</button>
      BPM
      <input
        className={styles.bpm}
        type="number"
        min="1"
        onChange={handleBpmChange}
        value={bpm}
      />
      <AddInstrument />
    </div>
  );
}
