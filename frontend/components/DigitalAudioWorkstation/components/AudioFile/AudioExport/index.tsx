import React, { useState, useEffect } from "react";
import * as Tone from "tone";

export default function AudioExport() {
  /** Notes, need to disable Play/Stop in controller when audio
   * export is running.
   */
  const [recorder, setRecorder] = useState<Tone.Recorder>();
  const [recording, setRecording] = useState<Blob>();
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    const newRecorder = new Tone.Recorder();
    setRecorder(newRecorder);
  }, [])

  const startRecording = () => {
    if (recorder) {
      Tone.getDestination().connect(recorder);
    }
    recorder?.start();
    Tone.start();
    Tone.Transport.start();
    setRunning(true);
  }

  const endRecording = async () => {
    Tone.Transport.stop();
    const newRecording = await recorder?.stop();
    setRunning(false);
    setRecording(newRecording);
  }

  const downloadRecording = () => {
    if (!recording) {
      return;
    }
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = "recording.wav";
    anchor.href = url;
    anchor.click();
  }
  return (
    <div>
      <button disabled={running} onClick={startRecording}>Start New Recording</button>
      <button disabled={!running} onClick={endRecording}>End Recording</button>
      <button disabled={!recording} onClick={downloadRecording}>Download Recording</button>
    </div>
  );
}