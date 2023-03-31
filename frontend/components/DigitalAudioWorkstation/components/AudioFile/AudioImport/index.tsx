import React, { useState, useEffect } from "react";
import styles from "./audio-import.module.scss";
import { importAudio, getAudio, deleteAudio } from "@/services/api-service";
import { useRouter } from "next/router";
import * as Tone from "tone";

/** Currently on HIATUS */
export default function AudioImport() {
  const [player, setPlayer] = useState<Tone.Player>();
  const [audioURL, setAudioURL] = useState("");
  const [fileId, setFileId] = useState<any | null>(null);

  useEffect(() => {
    if (!player) {
      const newPlayer = new Tone.Player();
      newPlayer.autostart = true;
      newPlayer.loop = true;
      newPlayer.sync();
      newPlayer.chain(Tone.Destination);
      setPlayer(newPlayer);
    }
  }, []);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //alert(event.target)
    //setSelectedFile(event.target.value);
  }

  const clickImportAudio = (e) => {
    e.preventDefault();
    //Only one at a time, delete old file, can be async.
    if (fileId != null) {
      deleteAudio(fileId);
    }
    const formData = new FormData(e.target);
    alert(JSON.stringify(e.target.file.files));
    /*
    importAudio(formData).then(function (audiofile) {
      setFileId(audiofile.id);
      getAudio(fileId).then(function (audio) {
        setAudioURL(audio);
        player?.load(audioURL);
        setPlayer(player);
      })
    })
    */
  };

  return (
    <div className={styles.body}>
      <form onSubmit={clickImportAudio} className={styles.form}>
        <input type="file" name="file" accept="audio/*" />
        <input type="submit" value="Import Audio" />
      </form>
    </div>
  );
}
