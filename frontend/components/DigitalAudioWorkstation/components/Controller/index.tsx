import React, { useState, useEffect } from "react";
import styles from "./controller.module.scss";
import * as Tone from "tone";
import { getBpm, updateBpm } from "../../adapter";
import { defaultBpm } from "../../instruments";
import AudioExport from "../AudioFile/AudioExport";
import AudioImport from "../AudioFile/AudioImport";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

export default function Controller() {
  const [bpm, setBpm] = useState(defaultBpm.toString());
  const [isPlaying, setIsPlaying] = useState(false);

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
      setIsPlaying(true);
    } else {
      Tone.Transport.stop();
      setIsPlaying(false);
    }
  }

  return (
    <IconContext.Provider value={{ size: "4em" }}>
      <div className={styles.container}>
        {/* <AudioImport /> */}
        <div className={styles.playControls}>
          <button className={styles.playButton} onClick={onPlay}>
            {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
          </button>
          <AudioExport />
        </div>
        <div className={styles.bpm}>
          BPM
          <input type="number" min="1" onChange={handleBpmChange} value={bpm} />
        </div>
      </div>
    </IconContext.Provider>
  );
}
