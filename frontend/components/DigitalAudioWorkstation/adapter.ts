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
    }
  ]
  */

let updateNoteGrid = function (
  noteGridId: string,
  newNoteGrid: any,
) {
  const gridState: any = doc.getMap(`notegridState-${noteGridId}`);
  gridState.set("notegrid", newNoteGrid);
};

let getNoteGrid = function (
  noteGridId: string,
) {
  const gridState: any = doc.getMap(`notegridState-${noteGridId}`);
  const grid = gridState.get("notegrid");
  return (grid);
}

let updateSequence = function (
  compositionId: string,
  partId: string,
  newSequence: any
) {
  const composition: any = doc.getMap(`composition-${compositionId}`);
  const part = composition.get(`part-${partId}`);
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
  part.set("sequence", new Y.Array());
};

export { updateSequence, addPart, updateNoteGrid, getNoteGrid };
