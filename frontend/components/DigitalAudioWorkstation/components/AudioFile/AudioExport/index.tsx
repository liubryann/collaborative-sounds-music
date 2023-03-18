import React, { useState, useEffect } from "react";
import * as Tone from "tone";

export default function AudioExport() {
  const recorder = new Tone.Recorder();
  const tone = Tone.Transport.connect(recorder);
  let recording: Blob | null = null;
  const startRecording = () => {
    recorder.start();
  }

  const endRecording = async () => {
    recording = await recorder.stop();
  }

  const downloadRecording = () => {
    if (!recording) {
      return;
    }
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = "recording.webm";
    anchor.href = url;
    anchor.click();
  }
  return (
    <div>
      <button onClick={startRecording}>Start New Recording</button>
      <button onClick={endRecording}>End Recording</button>
      <button onClick={downloadRecording}>Download Recording</button>
    </div>
  );
}