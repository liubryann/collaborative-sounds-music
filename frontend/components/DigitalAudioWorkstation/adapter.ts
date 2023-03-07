import { doc } from "./connection";
import * as Y from "yjs";
("use strict");
/*
  NOTE: one room to one composition
  TODO: create a new collection to hold all rooms with room metadata 
  (with backend support)

  composition: [ 
    "part-id": {
      "instrument": "synth",
      "sequence": [
        {duration: "4n", note: "C1", time: "0:0"},
        {duration: "4n", note: "C1", time: "0:1"},
        {duration: "4n", note: "C1", time: "0:2"},
        ...
      ]
      "grid": [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ]
    }
  ]
  */

let updatePart = function (
  compositionId: string,
  partId: string,
  newSequence: any,
  newGrid: any
) {
  doc.transact(() => {
    const composition: any = doc.getMap("composition");
    const part = composition.get(`part-${partId}`);
    part.set("grid", newGrid);
    part.set("sequence", newSequence);
  });
};

let addPart = function (
  compositionId: string,
  partId: string,
  instrument: string
) {
  const composition = doc.getMap("composition");
  if (composition.has(`part-${partId}`)) {
    console.error("part already exists");
    return;
  }
  const part: any = composition.set(`part-${partId}`, new Y.Map());
  part.set("instrument", instrument);
  part.set("grid", null);
  part.set("sequence", null);
};

let getComposition = function (compositionId: string) {
  return doc.getMap("composition");
};

let getNoteGrid = function (compositionId: string, partId: string) {
  const composition: any = doc.getMap("composition");
  const part = composition.get(`part-${partId}`);
  const grid = part.get("grid");
  return grid;
};

let getSequence = function (compositionId: string, partId: string) {
  const composition: any = doc.getMap("composition");
  const part = composition.get(`part-${partId}`);
  const grid = part.get("sequence");
  return grid;
};

export { doc, updatePart, addPart, getComposition, getNoteGrid, getSequence };
