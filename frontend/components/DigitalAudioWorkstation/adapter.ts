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

// test code
// let increment = function () {
//   const map = doc.getMap("map");
//   const count = map.get("count") || 0;
//   map.set("count", count + 1);
//   console.log(count);
// };

// let getValue = function () {
//   const map = doc.getMap("map");
//   const count = map.get("count") || 0;
//   console.log(count);
// };

let updateSequence = function (
  compositionId: string,
  partId: string,
  newSequence: any
) {
  const composition: any = doc.getMap(`composition-${compositionId}`);
  const sequence = composition.get(`part-${partId}`).get("sequence");
  sequence.set(newSequence);
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

// let addComposition = function (compositionId) {
//   const composition = doc.getMap(`composition-${compositionId}`, new Y.Map());
// };

// let getDoc = function () {};

// let init = function () {
//   connectAndSyncDoc("first-composition");
// };

export { updateSequence, addPart };
