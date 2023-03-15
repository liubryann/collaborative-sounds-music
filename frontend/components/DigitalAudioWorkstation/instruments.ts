import * as Tone from "tone";

const SYNTH = "Synth";
const KICK = "Kick";

export const instrumentNames = [SYNTH, KICK];

export type Instrument = Tone.Synth<Tone.SynthOptions> | Tone.NoiseSynth;
interface Instruments {
  [key: string]: (volume: number) => Instrument;
}

function convertVolume(volume: number) {
  return (volume / 100) * 60 - 60;
}

export const instruments: Instruments = {
  [SYNTH]: (volume: number) =>
    new Tone.Synth({ volume: convertVolume(volume) }).toDestination(),
  [KICK]: (volume: number) =>
    new Tone.MembraneSynth({ volume: convertVolume(volume) }).toDestination(),
};

export interface Note {
  time: string | number;
  note: Tone.Unit.Frequency;
  duration: string;
}

const octave = 1;
const bar = 0;
export const gridLength = 4;
export const baseNoteLength = "4n";
export const notes = [`C${octave}`, `D${octave}`, `E${octave}`];

export const getDefaultNoteGrid = () => {
  return [...Array(notes.length)].map((x) => Array(gridLength).fill(null));
};

export const getDefaultSequence: () => Note[] = () => {
  const defaultSequence = [];
  for (let i = 0; i < gridLength; i++) {
    defaultSequence.push({
      time: `${bar}:${i}`,
      note: 0,
      duration: baseNoteLength,
    });
  }
  return defaultSequence;
};
