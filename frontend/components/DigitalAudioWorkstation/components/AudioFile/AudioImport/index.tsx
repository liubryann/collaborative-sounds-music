import React, { useState, useEffect } from "react";
import * as Tone from "tone";

/** Currently on HIATUS */
export default function AudioImport() {
  const [player, setPlayer] = useState<Tone.Player>();

  useEffect(() => {
    if (!player) {
      const newPlayer = new Tone.Player();
      setPlayer(newPlayer);
    }
  }, []);

  const clickImportAudio = () => {};

  return (
    <div>
      <button onClick={clickImportAudio}>Import Audio</button>
      <input type="file" name="audiofile" accept="audio/*" />
    </div>
  );
}
