import * as Tone from "tone";

const SYNTH = "Synth";
const KICK = "Kick";

export const instrumentNames = [SYNTH, KICK];

interface Instruments {
  [key: string]: () => Tone.Synth<Tone.SynthOptions> | Tone.NoiseSynth;
}

export const instruments: Instruments = {
  [SYNTH]: () => new Tone.Synth().toDestination(),
  [KICK]: () => new Tone.MembraneSynth({ volume: 6 }).toDestination(),
};

export interface Note {
  time: string | number;
  note: Tone.Unit.Frequency;
  duration: string;
}

const octave = 1;
const bar = 0;
export const gridLength = 4;
export const notes = [`C${octave}`, `D${octave}`, `E${octave}`];

export const getDefaultNoteGrid = () => {
  return [...Array(notes.length)].map((x) => Array(gridLength).fill(false));
};

export const getDefaultSequence: () => Note[] = () => {
  const defaultSequence = [];
  for (let i = 0; i < gridLength; i++) {
    defaultSequence.push({
      time: `${bar}:${i}`,
      note: 0,
      duration: "4n",
    });
  }
  return defaultSequence;
};
