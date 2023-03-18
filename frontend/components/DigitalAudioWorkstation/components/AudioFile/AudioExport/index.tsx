import React, { useState, useEffect } from "react";
import styles from "./audio-export.module.scss";
import * as Tone from "tone";

export default function AudioExport() {
  /** Notes, need to disable Play/Stop in controller when audio
   * export is running.
   */
  const [recorder, setRecorder] = useState<Tone.Recorder>();
  const [recording, setRecording] = useState<Blob>();
  const [running, setRunning] = useState<boolean>(false);
  const [options, setOptions] = useState({filename: 'recording', extension: 'webm'});
  const [elapsedTime, setElapsed] = useState(0);
  const [counter, setCounter] = useState<NodeJS.Timer>();

  useEffect(() => {
    const newRecorder = new Tone.Recorder();
    setRecorder(newRecorder);
  }, [])

  /** Counter commands */
  const count = () => {
    const newTime = elapsedTime + 1;
    setElapsed(newTime);
  }

  const startCount = () => {
    const newCounter = setInterval(count, 1000);
    setCounter(newCounter);
  }

  const stopCount = () => {
    clearInterval(counter);
  }

  /** Recording commands */
  const startRecording = () => {
    setElapsed(0);
    if (recorder) {
      Tone.getDestination().connect(recorder);
    }
    recorder?.start();
    Tone.start();
    Tone.Transport.start();
    startCount();
    setRunning(true);
  }

  const endRecording = async () => {
    Tone.Transport.stop();
    const newRecording = await recorder?.stop();
    stopCount();
    setRunning(false);
    setRecording(newRecording);
  }

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {filename: e.target.value, extension: options.extension}
    setOptions(newOptions);
  }

  const extensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOptions = {filename: options.filename, extension: e.target.value}
    setOptions(newOptions);
  }

  const downloadRecording = () => {
    if (!recording) {
      return;
    }
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = options.filename + "." + options.extension;
    anchor.href = url;
    anchor.click();
  }

  return (
    <div>
      <button disabled={running} onClick={startRecording}>Start New Recording</button>
      <div className="timer">
        {elapsedTime}
      </div>
      <button disabled={!running} onClick={endRecording}>End Recording</button>
      <form onSubmit={downloadRecording}>
        <input type="text" name="filename" value={options.filename} onChange={nameChange}/>
        <select value={options.extension} onChange={extensionChange}>
          <option value="webm">.webm (Recommended)</option>
          <option value="wav">.wav</option>
          <option value="mp3">.mp3</option>
        </select>
        <input type="submit" disabled={!recording} value="Download Recording"/>
      </form>
    </div>
  );
}