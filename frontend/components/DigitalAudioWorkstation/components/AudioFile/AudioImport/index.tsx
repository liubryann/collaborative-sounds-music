import React, { useState, useEffect } from "react";
import styles from "./audio-import.module.scss";
import * as Tone from "tone";

/** Currently on HIATUS */
export default function AudioImport() {
  const [player, setPlayer] = useState<Tone.Player>();
  const [options, setOptions] = useState({
    filename: "https://tonejs.github.io/audio/berklee/gong_1.mp3",
  });

  useEffect(() => {
    if (!player) {
      const newPlayer = new Tone.Player();
      newPlayer.autostart = true;
      newPlayer.loop = true;
      newPlayer.sync();
      setPlayer(newPlayer);
    }
  }, [player]);

  const changeOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {
      filename: e.target.value,
    };
    setOptions(newOptions);
  };

  /** Will convert audio to file upload once we decide */
  const clickImportAudio = (e: any) => {
    e.preventDefault();
    player?.load(options.filename);
    player?.chain(Tone.Destination);
    setPlayer(player);
  };

  return (
    <div className={styles.body}>
      <form onSubmit={clickImportAudio} className={styles.form}>
        <label>
          CONCEPT: NOT IMPLEMENTED
          <input type="file" name="audiofile" accept="audio/*" />
        </label>
        <label>
          CURRENT: URL TO AUDIO FILE
          <input
            type="text"
            name="audiofiletemp"
            value={options.filename}
            onChange={changeOptions}
          />
        </label>
        <input type="submit" value="Import Audio" />
      </form>
    </div>
  );
}
