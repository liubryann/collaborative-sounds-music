import React, { useEffect, useState } from "react";
import styles from "./digital-audio-workstation.module.scss";
import * as Tone from "tone";
import Controller from "./components/Controller";
import { useComposition } from "@/contexts/CompositionContext";
import apiService from "@/services/api-service";
import InstrumentConfigs from "./components/InstrumentConfigs";

export default function DigitalAudioWorkstation() {
  const composition = useComposition();

  const [instruments, setInstruments] = useState<
    Tone.Synth<Tone.SynthOptions>[]
  >([]);
  const [availableInstruments, setAvailableInstruments] = useState<string[]>(
    []
  );

  const [synth, setSynth] = useState<Tone.Synth<Tone.SynthOptions> | null>(
    null
  );

  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);
  }, []);

  useEffect(() => {
    apiService.getAvailableInstruments().then((instruments: string[]) => {
      console.log(instruments);
      setAvailableInstruments(instruments);
    });
  }, []);

  const onclick = () => {
    synth?.triggerAttackRelease("C4", "8n");
  };

  function onPlay() {
    return;
  }

  function onPause() {
    return;
  }

  return (
    <div className={styles.test}>
      {composition?.instruments.map((instrument) => {
        return <InstrumentConfigs key={instrument} instrument={instrument} />;
      })}
      <button onClick={onclick}>click me</button>
      <Controller
        onPlay={onPlay}
        onPause={onPause}
        availableInstruments={availableInstruments}
      />
      {composition?.counter}
    </div>
  );
}
