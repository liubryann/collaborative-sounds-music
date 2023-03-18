import * as Tone from "tone";
import { PolySynth } from "tone";

const SYNTH = "Synth";
const POLYSYNTH = "PolySynth";
const KICK = "Kick";

export const instrumentNames = [KICK, POLYSYNTH];

export type Instrument =
  | Tone.Synth<Tone.SynthOptions>
  | Tone.NoiseSynth
  | PolySynth<any>;
interface Instruments {
  [key: string]: (volume: number) => Instrument;
}

function convertVolume(volume: number) {
  return (volume / 100) * 60 - 60;
}

export const getToneInstrument: Instruments = {
  [KICK]: (volume: number) =>
    new Tone.PolySynth(Tone.MembraneSynth, {
      volume: convertVolume(volume),
    }).toDestination(),
  [POLYSYNTH]: (volume: number) =>
    new Tone.PolySynth(Tone.Synth, {
      volume: convertVolume(volume),
    }).toDestination(),
};

export interface Note {
  time: string | number;
  note: Tone.Unit.Frequency;
  duration: string;
}

const numBars = 2;
export const loopEnd = `${numBars}m`;
export const gridLength = numBars * 16;
export const baseNoteLength = "16n";
export const notes = [
  "C1",
  "C#1",
  "D1",
  "D#1",
  "E1",
  "F1",
  "F#1",
  "G1",
  "G#1",
  "A1",
  "A#1",
  "B1",
  "C2",
  "C#2",
  "D2",
  "D#2",
  "E2",
  "F2",
  "F#2",
  "G2",
  "G#2",
  "A2",
  "A#2",
  "B2",
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
];
export const defaultBpm = 120;

export const getDefaultNoteGrid = () => {
  return [...Array(notes.length)].map((x) => Array(gridLength).fill(null));
};

export const getDefaultSequence: () => Note[] = () => {
  const defaultSequence = [];
  for (let bar = 0; bar < numBars; bar++) {
    for (let quarterNote = 0; quarterNote < 4; quarterNote++) {
      for (let sixteenthNote = 0; sixteenthNote < 4; sixteenthNote++) {
        defaultSequence.push({
          time: `${bar}:${quarterNote}:${sixteenthNote}`,
          note: 0,
          duration: baseNoteLength,
        });
      }
    }
  }
  return defaultSequence;
};
