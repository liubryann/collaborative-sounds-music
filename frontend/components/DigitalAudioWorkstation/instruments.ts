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
