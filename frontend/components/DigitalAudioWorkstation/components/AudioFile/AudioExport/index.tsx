import React, { useState, useEffect, useRef } from "react";
import styles from "./audio-export.module.scss";
import * as Tone from "tone";

export default function AudioExport() {
  /** Notes, need to disable Play/Stop in controller when audio
   * export is running.
   */
  const [recorder, setRecorder] = useState<Tone.Recorder>();
  const [recording, setRecording] = useState<Blob>();
  const [running, setRunning] = useState<boolean>(false);
  const [options, setOptions] = useState({
    filename: "recording",
    extension: "webm",
  });
  const [timer, setTimer] = useState(0);
  const [timerStart, setTimerStart] = useState(false);
  const tick = useRef();

  useEffect(() => {
    if (!recorder) {
      const newRecorder = new Tone.Recorder();
      setRecorder(newRecorder);
    }

    if (timerStart) {
      tick.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 10);
    } else {
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [timerStart]);

  /** Recording commands */
  const startRecording = () => {
    if (recorder) {
      Tone.getDestination().connect(recorder);
    }
    setTimerStart(true);
    recorder?.start();
    Tone.start();
    Tone.Transport.start();
    setRunning(true);
  };

  const endRecording = async () => {
    Tone.Transport.stop();
    const newRecording = await recorder?.stop();
    setTimerStart(false);
    setRunning(false);
    setRecording(newRecording);
  };

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = {
      filename: e.target.value,
      extension: options.extension,
    };
    setOptions(newOptions);
  };

  const extensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOptions = {
      filename: options.filename,
      extension: e.target.value,
    };
    setOptions(newOptions);
  };

  const downloadRecording = () => {
    if (!recording) {
      return;
    }
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = options.filename + "." + options.extension;
    anchor.href = url;
    anchor.click();
  };

  return (
    <div>
      <button disabled={running} onClick={startRecording}>
        Start New Recording
      </button>
      <div className="timer">
        Elapsed time: {Math.floor(timer / 6000)} :{" "}
        {Math.floor((timer % 6000) / 100)} : {Math.floor(timer % 100)}
      </div>
      <button disabled={!running} onClick={endRecording}>
        End Recording
      </button>
      <form onSubmit={downloadRecording}>
        <label>
          Name:
          <input
            type="text"
            name="filename"
            value={options.filename}
            onChange={nameChange}
          />
        </label>
        <label>
          Type:
          <select value={options.extension} onChange={extensionChange}>
            <option value="webm">.webm (Recommended)</option>
            <option value="wav">.wav</option>
            <option value="mp3">.mp3</option>
          </select>
        </label>
        <input type="submit" disabled={!recording} value="Download Recording" />
      </form>
    </div>
  );
}
