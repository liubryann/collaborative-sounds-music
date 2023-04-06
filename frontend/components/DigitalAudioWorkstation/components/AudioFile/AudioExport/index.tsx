import React, { useState, useEffect, useRef } from "react";
import styles from "./audio-export.module.scss";
import * as Tone from "tone";
import { BsFillRecordCircleFill, BsStopCircleFill } from "react-icons/bs";
import { IconContext } from "react-icons";

interface AudioExportProps {
  play: () => void;
  pause: () => void;
}

export default function AudioExport({ play, pause }: AudioExportProps) {
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
  const [openModal, setOpenModal] = useState(false);
  const tick = useRef<any>();

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
  }, [timerStart, recorder]);

  /** Recording commands */
  const startRecording = () => {
    if (recorder) {
      Tone.getDestination().connect(recorder);
    }
    setTimerStart(true);
    recorder?.start();
    play();
    setRunning(true);
  };

  const endRecording = async () => {
    pause();
    const newRecording = await recorder?.stop();
    setTimerStart(false);
    setRunning(false);
    setRecording(newRecording);
    setOpenModal(true);
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

  const downloadRecording = (e: any) => {
    e.preventDefault();
    if (!recording) {
      return;
    }
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = options.filename + "." + options.extension;
    anchor.href = url;
    anchor.click();
    setOpenModal(false);
  };

  return (
    <IconContext.Provider value={{ size: "1.5em", style: { color: "red" } }}>
      <div className={styles.wrapper}>
        {running ? (
          <button
            className={styles.recordButton}
            disabled={!running}
            onClick={endRecording}
          >
            <BsStopCircleFill />
          </button>
        ) : (
          <button
            className={styles.recordButton}
            disabled={running}
            onClick={startRecording}
          >
            <BsFillRecordCircleFill />
          </button>
        )}

        <span className={styles.timer}>
          {Math.floor(timer / 6000)}:{Math.floor((timer % 6000) / 100)}:
          {Math.floor(timer % 100)}
        </span>

        {openModal && (
          <div className={styles.saveModalBackground}>
            <form className={styles.saveModal} onSubmit={downloadRecording}>
              <label>
                <span>Name:</span>
                <input
                  type="text"
                  name="filename"
                  value={options.filename}
                  onChange={nameChange}
                  className={styles.input}
                />
              </label>
              <label>
                <span>Type:</span>
                <select
                  value={options.extension}
                  onChange={extensionChange}
                  className={styles.input}
                >
                  <option value="webm">.webm (Recommended)</option>
                  <option value="wav">.wav</option>
                  <option value="mp3">.mp3</option>
                </select>
              </label>
              <div>
                <input
                  className={styles.button}
                  type="submit"
                  disabled={!recording}
                  value="Save"
                />
                <button
                  className={styles.button}
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </IconContext.Provider>
  );
}
