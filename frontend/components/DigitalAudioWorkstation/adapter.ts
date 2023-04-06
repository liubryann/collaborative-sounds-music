import { doc, Y } from "./connection";
import { schema } from "./constants";
import { getDefaultNoteGrid, getDefaultSequence, notes } from "./instruments";
import * as Sentry from "@sentry/nextjs";
("use strict");
/*
  NOTE: one room to one composition
  TODO: create a new collection to hold all rooms with room metadata 
  (with backend support)

  "part-id": {
    "instrument": "synth",
    "sequence": [
      {duration: "4n", note: "C1", time: "0:0"},
      {duration: "4n", note: "C1", time: "0:1"},
      {duration: "4n", note: "C1", time: "0:2"},
      ...
    ]
    "notegrid": [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false]
    ]
  }
  parts : []
  */

// get the bpm
const getBpm = function (): Y.Text {
  return doc.getText(schema.BPM);
};

// update the bpm
const updateBpm = function (bpm: string): void {
  if (+bpm < 0) {
    console.error("bpm cannot be negative");
    return;
  }
  try {
    const bpmText = doc.getText(schema.BPM);
    doc.transact(() => {
      bpmText.delete(0, bpmText.length);
      bpmText.insert(0, bpm);
    });
  } catch (e) {
    Sentry.captureException(e);
  }
};

// add a new instrument to the list of instruments
const addPart = function (partId: string): void {
  const parts = doc.getArray(schema.PARTS);

  for (let part of parts) {
    if (part === partId) {
      console.error("partId already exists");
      return;
    }
  }
  try {
    doc.transact(() => {
      const part = doc.getMap(partId);

      const instrument = new Y.Map();
      instrument.set(schema.INSTRUMENT_TYPE, "Synth");
      instrument.set(schema.INSTRUMENT_VOLUME, 100);
      instrument.set(schema.INSTRUMENT_OSCILLATOR, "triangle");
      part.set(schema.INSTRUMENT, instrument);

      part.set(schema.NOTE_GRID, Y.Array.from(getDefaultNoteGrid()));
      part.set(schema.SEQUENCE, Y.Array.from(getDefaultSequence()));
      parts.push([partId]);
    });
  } catch (e) {
    Sentry.captureException(e);
  }
};

// get the list of instruments
const getParts = function (): Y.Array<string> {
  return doc.getArray(schema.PARTS);
};

// delete an instrument from the list of instruments
const deletePart = function (partId: string): void {
  try {
    const parts = doc.getArray(schema.PARTS);
    for (let i = 0; i < parts.length; i++) {
      if (parts.get(i) === partId) {
        parts.delete(i, 1);
        break;
      }
    }
  } catch (e) {
    Sentry.captureException(e);
  }
};

// get a part
const getPart = function (partId: string) {
  return doc.getMap(partId);
};

// update the note grid and sequence
const updateNoteGridAndSequence = function (
  partId: string,
  i: number,
  j: number,
  duration: string,
  set: boolean
) {
  try {
    const part = doc.getMap(partId);
    const noteGrid: any = part.get(schema.NOTE_GRID);
    let row: any = noteGrid.get(j);

    if (set) {
      row[i] = duration;
      row = row.map((cell: boolean | null) => {
        if (cell !== null) {
          return duration;
        }
        return cell;
      });
    } else {
      row[i] = null;
    }

    const sequence: any = part.get(schema.SEQUENCE);
    let newNote = sequence.get(j);
    if (set) {
      if (newNote.note === 0) {
        newNote.note = [notes[i]];
      } else {
        if (!newNote.note.includes(notes[i])) {
          newNote.note.push(notes[i]);
        }
      }
      newNote.duration = duration;
    } else {
      if (newNote.note.length === 1) {
        newNote.note = 0;
      } else {
        newNote.note.splice(newNote.note.indexOf(notes[i]), 1);
      }
    }
    doc.transact(() => {
      noteGrid.delete(j, 1);
      noteGrid.insert(j, [row]);
      sequence.delete(j, 1);
      sequence.insert(j, [newNote]);
    });
  } catch (e) {
    Sentry.captureException(e);
  }
};

// get the note grid
const getNoteGrid = function (partId: string): any {
  return doc.getMap(partId).get(schema.NOTE_GRID);
};

// get the sequence of notes
const getSequence = function (partId: string) {
  return doc.getMap(partId).get(schema.SEQUENCE) as Y.Array<any>;
};

// get the instrument
const getInstrument = function (partId: string): Y.Map<any> {
  return doc.getMap(partId).get(schema.INSTRUMENT) as Y.Map<any>;
};

// update the volume of the instrument
const updateInstrumentVolume = function (partId: string, volume: string) {
  try {
    const instrument = getInstrument(partId);
    instrument.set(schema.INSTRUMENT_VOLUME, volume);
  } catch (e) {
    Sentry.captureException(e);
  }
};

const updateInstrumentOscillator = function (
  partId: string,
  oscillator: string
) {
  try {
    const instrument = getInstrument(partId);
    instrument.set(schema.INSTRUMENT_OSCILLATOR, oscillator);
  } catch (e) {
    Sentry.captureException(e);
  }
};

const destroyDocument = function () {
  try {
    doc.destroy();
  } catch (e) {
    Sentry.captureException(e);
  }
};

const updateInstrumentType = function (partId: string, instrumentType: string) {
  try {
    const instrument = getInstrument(partId);
    instrument.set(schema.INSTRUMENT_TYPE, instrumentType);
  } catch (e) {
    Sentry.captureException(e);
  }
};

export {
  Y,
  doc,
  addPart,
  getParts,
  deletePart,
  getPart,
  updateNoteGridAndSequence,
  getNoteGrid,
  getSequence,
  getInstrument,
  updateInstrumentVolume,
  getBpm,
  updateBpm,
  destroyDocument,
  updateInstrumentOscillator,
  updateInstrumentType,
};
