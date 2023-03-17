import React, { useEffect, useState, useCallback } from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import InstrumentSettings from "./components/InstrumentSettings";
import { connectAndSyncDoc } from "./connection";
import {
  getParts,
  updateNoteGridAndSequence,
  Y,
  getInstrument,
  getSequence,
} from "./adapter";
import NoteLengthModal from "./components/NoteLengthModal";
import InstrumentNotes from "./components/InstrumentNotes";
import { Instrument, getToneInstrument, Note } from "./instruments";
import { schema } from "./constants";
import * as Tone from "tone";

export default function DigitalAudioWorkstation() {
  const [parts, setParts] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [contextSelectedCell, setContextSelectedCell] = useState<{
    partId: string;
    i: number;
    j: number;
  } | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  useEffect(() => {
    connectAndSyncDoc("test");
  }, []);

  // close the note length modal
  useEffect(() => {
    const clickEventHandler = () => {
      setMousePos(null);
    };

    window.addEventListener("click", clickEventHandler);
    return () => {
      window.removeEventListener("click", clickEventHandler);
    };
  }, []);

  // open the note length modal
  function openModal(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    partId: string,
    i: number,
    j: number
  ) {
    e.preventDefault();
    setMousePos({ x: e.clientX, y: e.clientY });
    setContextSelectedCell({ partId, i, j });
  }

  // select the note length for the note
  function selectNoteLength(duration: string) {
    if (contextSelectedCell) {
      updateNoteGridAndSequence(
        contextSelectedCell.partId,
        contextSelectedCell.i,
        contextSelectedCell.j,
        duration,
        true
      );
    }
  }

  // below is the code for the Tone.js stuff
  // TODO: these can probably be changed to useRef
  const [instruments, setInstruments] = useState<{
    [partId: string]: Instrument;
  }>({});
  const [sequences, setSequences] = useState<{ [partId: string]: Note[] }>({});
  const [toneParts, setToneParts] = useState<{ [partId: string]: Tone.Part }>(
    {}
  );

  useEffect(() => {
    const yInstruments = getParts();

    yInstruments.observe((event) => {
      const newParts = [...getParts()];

      // yjs doesn't tell you what was deleted so we have to check for it manually which sucks
      setParts((prevParts) => {
        if (event.changes.deleted.size > 0) {
          prevParts
            .filter((x) => !newParts.includes(x))
            .forEach((x) => {
              setToneParts((prev) => {
                prev[x].dispose();
                delete prev[x];
                return { ...prev };
              });

              setInstruments((prev) => {
                delete prev[x];
                return { ...prev };
              });
              setSequences((prev) => {
                delete prev[x];
                return { ...prev };
              });
            });
        }
        return newParts;
      });
    });
  }, []);

  // handle selectedPart when deleting instruments
  useEffect(() => {
    setSelectedPart((prev) => {
      if (prev && !parts.includes(prev)) {
        if (parts.length === 0) {
          return null;
        } else {
          return parts[parts.length - 1];
        }
      }
      return prev;
    });
  }, [parts]);

  // create a new part for Tone.js
  const createNewPart = useCallback(
    (instrument: Instrument, sequence: Note[], partId: string): void => {
      if (!instrument) {
        console.log("error"); // TODO: this shows up but doesn't affect functionality
        return;
      }
      const newSeq = sequence.filter((note: any) => note.note !== 0); // TODO: this is pretty inefficient but it works for now

      const newPart = new Tone.Part((time, value) => {
        instrument.triggerAttackRelease(value.note, value.duration, time);
      }, newSeq).start(0);
      newPart.loop = true;

      setToneParts((prev) => {
        prev[partId]?.dispose();
        return { ...prev, [partId]: newPart };
      });
    },
    []
  );

  // parse the yjs instrument into a Tone.js instrument
  function parseYInstrument(yInstrument: Y.Map<any>): Instrument {
    const yInstrumentName = yInstrument.get(schema.INSTRUMENT_NAME);
    const yVolume = yInstrument.get(schema.INSTRUMENT_VOLUME);
    return getToneInstrument[yInstrumentName](yVolume);
  }

  // observe the yjs instruments and sequences and update the Tone.js parts
  // TODO: if we change to useRef, we can probably do this effect per new part instead of all of them
  useEffect(() => {
    parts.forEach((partId) => {
      const yInstrument = getInstrument(partId);
      let newInstrument = parseYInstrument(yInstrument);

      const ySequence = getSequence(partId);
      let newSequence = ySequence.toArray();
      setSequences((prev) => ({ ...prev, [partId]: newSequence }));
      setInstruments((prev) => ({ ...prev, [partId]: newInstrument }));
      createNewPart(newInstrument, ySequence.toArray(), partId);

      yInstrument.observeDeep((e) => {
        newInstrument = parseYInstrument(yInstrument);
        setInstruments((prev) => ({ ...prev, [partId]: newInstrument }));
        createNewPart(newInstrument, getSequence(partId).toArray(), partId);
      });
      ySequence.observeDeep((e) => {
        newSequence = getSequence(partId).toArray();
        setSequences((prev) => ({ ...prev, [partId]: newSequence }));
        createNewPart(parseYInstrument(yInstrument), newSequence, partId);
      });
    });
  }, [parts, createNewPart]);

  return (
    <div>
      {parts.map((partId) => {
        return (
          <InstrumentSettings
            key={partId}
            partId={partId}
            selectPart={setSelectedPart}
            selectedPart={selectedPart === partId}
          />
        );
      })}
      {selectedPart && (
        <InstrumentNotes partId={selectedPart} openModal={openModal} />
      )}
      <Controller />
      {mousePos && (
        <NoteLengthModal
          position={mousePos}
          selectNoteLength={selectNoteLength}
        />
      )}
    </div>
  );
}
