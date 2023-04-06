import * as Tone from "tone";

export type Instrument =
  | Tone.NoiseSynth
  | Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
interface Instruments {
  [key: string]: (volume: number, oscillator: string) => Instrument;
}

export const oscillatorTypes = [
  "pulse",
  "sine",
  "square",
  "triangle",
  "sawtooth",
];

export const instrumentTypes = [
  "Synth",
  "AMSynth",
  "DuoSynth",
  "FMSynth",
  "MembraneSynth",
  "MetalSynth",
  "MonoSynth",
  "NoiseSynth",
  "PluckSynth",
];

function convertVolume(volume: number) {
  return (volume / 100) * 60 - 60;
}

export const getToneInstrument = (
  instrumentType: string,
  volume: number,
  oscillator: string
): Instrument => {
  if (instrumentType === "NoiseSynth") {
    const lowPass = new Tone.Filter({
      frequency: 8000,
    });
    return new Tone.NoiseSynth({
      volume: convertVolume(volume),
      noise: {
        type: "white",
        playbackRate: 3,
      },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.15,
        release: 0.03,
      },
    })
      .connect(lowPass)
      .toDestination();
  }
  // @ts-ignore
  return new Tone.PolySynth(Tone[instrumentType], {
    volume: convertVolume(volume),
    oscillator: {
      // @ts-ignore
      type: oscillator || "triangle",
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
  }).toDestination();
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
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
];
export const defaultBpm = 120;

export const getDefaultNoteGrid = () => {
  return [...Array(gridLength)].map((x) => Array(notes.length).fill(null));
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
