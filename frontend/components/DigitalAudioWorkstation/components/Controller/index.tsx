import React, { useState, useEffect } from "react";
import styles from "./controller.module.scss";
import * as Tone from "tone";
import { getBpm, updateBpm } from "../../adapter";
import { defaultBpm } from "../../instruments";
import AudioExport from "../AudioFile/AudioExport";
import AudioImport from "../AudioFile/AudioImport";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

interface ControllerProps {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
}

export default function Controller({
  play,
  pause,
  isPlaying,
}: ControllerProps) {
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

  return (
    <IconContext.Provider value={{ size: "4em" }}>
      <div className={styles.container}>
        <AudioImport />
        <div className={styles.playControls}>
          {isPlaying ? (
            <button className={styles.playButton} onClick={pause}>
              <AiFillPauseCircle />
            </button>
          ) : (
            <button className={styles.playButton} onClick={play}>
              <AiFillPlayCircle />
            </button>
          )}

          <AudioExport play={play} pause={pause} />
        </div>
        <div className={styles.bpm}>
          BPM
          <input type="number" min="1" onChange={handleBpmChange} value={bpm} />
        </div>
      </div>
    </IconContext.Provider>
  );
}
