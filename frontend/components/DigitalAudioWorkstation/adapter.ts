import { doc, Y } from "./connection";
import { schema } from "./constants";
import { getDefaultNoteGrid, getDefaultSequence, notes } from "./instruments";
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

// add a new instrument to the list of instruments
const addPart = function (instrumentName: string, partId: string): void {
  const parts = doc.getArray(schema.PARTS);

  for (let part of parts) {
    if (part === partId) {
      console.error("partId already exists");
      return;
    }
  }

  doc.transact(() => {
    const part = doc.getMap(partId);

    const instrument = new Y.Map();
    instrument.set(schema.INSTRUMENT_NAME, instrumentName);
    instrument.set(schema.INSTRUMENT_VOLUME, 100);
    part.set(schema.INSTRUMENT, instrument);

    part.set(schema.NOTE_GRID, Y.Array.from(getDefaultNoteGrid()));
    part.set(schema.SEQUENCE, Y.Array.from(getDefaultSequence()));
    parts.push([partId]);
  });
};

// get the list of instruments
const getParts = function (): Y.Array<string> {
  return doc.getArray(schema.PARTS);
};

// delete an instrument from the list of instruments
const deletePart = function (partId: string): void {
  const parts = doc.getArray(schema.PARTS);
  for (let i = 0; i < parts.length; i++) {
    if (parts.get(i) === partId) {
      parts.delete(i, 1);
      // TODO: clean up the respective instrument part
      break;
    }
  }
};

const getPart = function (partId: string) {
  return doc.getMap(partId);
};

const updateNoteGridAndSequence = function (
  partId: string,
  i: number,
  j: number
) {
  const part = doc.getMap(partId);
  const noteGrid = part.get(schema.NOTE_GRID);
  const row = noteGrid.get(i);
  row[j] = !row[j];

  const sequence = part.get(schema.SEQUENCE);
  let newNote = sequence.get(j);
  if (row[j]) {
    newNote.note = notes[i];
  } else {
    newNote.note = 0;
  }

  doc.transact(() => {
    noteGrid.delete(i, 1);
    noteGrid.insert(i, [row]);
    sequence.delete(j, 1);
    sequence.insert(j, [newNote]);
  });
};

const getNoteGrid = function (partId: string) {
  return doc.getMap(partId).get(schema.NOTE_GRID);
};

const getSequence = function (partId: string) {
  return doc.getMap(partId).get(schema.SEQUENCE);
};

const getInstrument = function (partId: string): Y.Map<any> {
  return doc.getMap(partId).get(schema.INSTRUMENT) as Y.Map<any>;
};

const updateInstrumentVolume = function (partId: string, volume: string) {
  const instrument = getInstrument(partId);
  instrument.set(schema.INSTRUMENT_VOLUME, volume);
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
};
