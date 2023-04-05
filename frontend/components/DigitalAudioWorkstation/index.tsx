import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import InstrumentSettings from "./components/InstrumentSettings";
import AddInstrument from "./components/AddInstrument";
import { connectAndSyncDoc } from "./connection";
import {
  parseAwarenessStates,
  removeUserPresence,
  setUserSelectedPartAwareness,
  setUserPresence,
  UserAwareness,
  SelectedPartAwareness,
  SelectedCellAwareness,
  setUserSelectedCellAwareness,
} from "./awarenessHelper";
import {
  getParts,
  updateNoteGridAndSequence,
  Y,
  getInstrument,
  getSequence,
  destroyDocument,
} from "./adapter";
import { useUser } from "@/contexts/UserContext";
import NoteLengthModal from "./components/NoteLengthModal";
import InstrumentNotes from "./components/InstrumentNotes";
import ActiveUsers from "./components/ActiveUsers";
import { Instrument, getToneInstrument, Note, loopEnd } from "./instruments";
import { schema } from "./constants";
import * as Tone from "tone";
import CollaborationController from "./components/CollaborationController";
import AiHelper from "./components/AiHelper";

interface DigitalAudioWorkstationProps {
  roomId: string;
}

export default function DigitalAudioWorkstation({
  roomId,
}: DigitalAudioWorkstationProps) {
  const user = useUser();
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

  // handle part select awareness
  useEffect(() => {
    if (selectedPart) {
      setUserSelectedPartAwareness(awareness.current, selectedPart);
    }
  }, [selectedPart]);

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
  const instruments = useRef<{ [partId: string]: Instrument }>({});
  const sequences = useRef<{ [partId: string]: Note[] }>({});
  const toneParts = useRef<{ [partId: string]: Tone.Part }>({});

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function play() {
    Tone.start();
    Tone.Transport.start("+0.1");
    setIsPlaying(true);
  }

  function pause() {
    Tone.Transport.pause();
    setIsPlaying(false);
  }

  useEffect(() => {
    connectAndSyncDoc(roomId).then((res) => {
      // awareness handling
      awareness.current = res;
      setUserPresence(awareness.current, user?.username);

      awareness.current.on("change", () => {
        const [
          usersAwarenessRes,
          selectedPartAwarenessRes,
          selectedCellAwarenessRes,
        ] = parseAwarenessStates(awareness.current);
        setUsersAwareness(usersAwarenessRes);
        setPartsAwareness(selectedPartAwarenessRes);
        setSelectedCellAwareness(selectedCellAwarenessRes);
      });

      const yParts = getParts();
      setParts(yParts.toArray());

      yParts.observe((event) => {
        const newParts = [...getParts()];

        // yjs doesn't tell you what was deleted so we have to check for it manually which sucks
        setParts((prevParts) => {
          if (event.changes.deleted.size > 0) {
            prevParts
              .filter((x) => !newParts.includes(x))
              .forEach((x) => {
                toneParts.current[x]?.dispose();
                delete toneParts.current[x];
                delete instruments.current[x];
                delete sequences.current[x];
              });
          }

          return newParts;
        });
      });
    });

    return () => {
      destroyDocument();
      removeUserPresence(awareness.current);

      // dispose of all the Tone.js parts
      Object.values(toneParts.current).forEach((part) => {
        part.dispose();
      });
      toneParts.current = {};
      instruments.current = {};
      sequences.current = {};
    };
  }, [roomId, user?.username]);

  // handle selectedPart when deleting instruments
  const partsLoaded = useRef<boolean>(false);
  useEffect(() => {
    if (!partsLoaded.current && parts.length > 0) {
      partsLoaded.current = true;
      setSelectedPart(parts[0]);
      return;
    }
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
      const newSeq = sequence.filter((note: Note) => note.note !== 0); // TODO: this is pretty inefficient but it works for now

      let newPart: Tone.Part;
      if (instrument instanceof Tone.NoiseSynth) {
        newPart = new Tone.Part((time, value) => {
          instrument.triggerAttackRelease(value.duration, time + 0.05);
        }, newSeq).start(0);
      } else {
        newPart = new Tone.Part((time, value) => {
          instrument.triggerAttackRelease(
            value.note,
            value.duration,
            time + 0.05
          );
        }, newSeq).start(0);
      }

      newPart.loopStart = 0;
      newPart.loopEnd = loopEnd;
      newPart.loop = true;
      toneParts.current[partId]?.dispose();
      toneParts.current[partId] = newPart;
    },
    []
  );

  // parse the yjs instrument into a Tone.js instrument
  function parseYInstrument(yInstrument: Y.Map<any>): Instrument {
    const yInstrumentType = yInstrument.get(schema.INSTRUMENT_TYPE);
    const yVolume = yInstrument.get(schema.INSTRUMENT_VOLUME);
    const yOscillator = yInstrument.get(schema.INSTRUMENT_OSCILLATOR);
    return getToneInstrument(yInstrumentType, yVolume, yOscillator);
  }

  // observe the yjs instruments and sequences and update the Tone.js parts
  // TODO: if we change to useRef, we can probably do this effect per new part instead of all of them
  useEffect(() => {
    parts.forEach((partId) => {
      const yInstrument = getInstrument(partId);
      let newInstrument = parseYInstrument(yInstrument);

      const ySequence = getSequence(partId);
      let newSequence = ySequence.toArray();
      sequences.current[partId] = newSequence;
      instruments.current[partId] = newInstrument;
      createNewPart(newInstrument, ySequence.toArray(), partId);

      yInstrument.observeDeep((e) => {
        newInstrument = parseYInstrument(yInstrument);
        instruments.current[partId] = newInstrument;
        createNewPart(newInstrument, getSequence(partId).toArray(), partId);
      });
      ySequence.observeDeep((e) => {
        newSequence = getSequence(partId).toArray();
        sequences.current[partId] = newSequence;
        createNewPart(parseYInstrument(yInstrument), newSequence, partId);
      });
    });
  }, [parts, createNewPart]);

  // below is awareness stuff
  const [usersAwareness, setUsersAwareness] = useState<UserAwareness[]>([]);
  const [partsAwareness, setPartsAwareness] = useState<SelectedPartAwareness>(
    {}
  );
  const [selectedCellAwareness, setSelectedCellAwareness] =
    useState<SelectedCellAwareness>({});
  const awareness = useRef<any>(null);

  function setCellSelectionAwarenessWrapper(
    partId: string,
    i: number,
    j: number
  ) {
    setUserSelectedCellAwareness(awareness.current, partId, i, j);
  }

  return (
    <div className={styles.container}>
      <div className={styles.userPresence}>
        <ActiveUsers activeUsers={usersAwareness} />
      </div>
      <div className={styles.collaboration}>
        <CollaborationController roomId={roomId} />
        <AiHelper />
      </div>
      <div className={styles.aiHelper}></div>
      <div className={styles.instrumentList}>
        <div className={styles.hiddenScroll}>
          {parts.map((partId) => {
            return (
              <InstrumentSettings
                key={partId}
                partId={partId}
                selectPart={setSelectedPart}
                selectedPart={selectedPart === partId}
                userColors={partsAwareness[partId]}
              />
            );
          })}
        </div>
        <AddInstrument pause={pause} />
      </div>
      <div className={styles.instrumentNotes}>
        {selectedPart && (
          <InstrumentNotes
            partId={selectedPart}
            openModal={openModal}
            selectedCellAwareness={selectedCellAwareness[selectedPart]}
            setSelectedCellAwareness={setCellSelectionAwarenessWrapper}
          />
        )}
      </div>
      <div className={styles.controller}>
        <Controller play={play} pause={pause} isPlaying={isPlaying} />
      </div>
      {mousePos && (
        <NoteLengthModal
          position={mousePos}
          selectNoteLength={selectNoteLength}
        />
      )}
    </div>
  );
}
