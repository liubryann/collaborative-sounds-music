import { doc } from "./connection";
import * as Y from "yjs";
("use strict");
/*

  composition-id: [ 
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
let getNoteGrid = function (compositionId: string, partId: string) {
  const composition: any = doc.getMap(`composition-${compositionId}`);
  const part = composition.get(`part-${partId}`);
  const grid = part.get("grid");
  return grid;
};

let updateSequence = function (
  compositionId: string,
  partId: string,
  newSequence: any,
  newGrid: any
) {
  const composition: any = doc.getMap(`composition-${compositionId}`);
  const part = composition.get(`part-${partId}`);
  part.set("grid", newGrid);
  part.set("sequence", newSequence);
};

let addPart = function (
  compositionId: string,
  partId: string,
  instrument: string
) {
  const composition = doc.getMap(`composition-${compositionId}`);
  if (composition.has(`part-${partId}`)) {
    console.error("part already exists");
    return;
  }
  const part: any = composition.set(`part-${partId}`, new Y.Map());
  part.set("instrument", instrument);
  part.set("grid", null);
  part.set("sequence", new Y.Array());
};

function getComposition(compositionId: string) {
  return doc.getMap(`composition-${compositionId}`);
}

export { updateSequence, addPart, getComposition, getNoteGrid };
