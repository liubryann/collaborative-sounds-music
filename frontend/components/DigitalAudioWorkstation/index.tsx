import React, { useEffect, useState, useMemo, useCallback } from "react";
import styles from "./digital-audio-workstation.module.scss";
import Controller from "./components/Controller";
import InstrumentContainer from "./components/InstrumentContainer";
import { connectAndSyncDoc } from "./connection";
import { getParts, updateNoteGridAndSequence } from "./adapter";
import NoteLengthModal from "./components/NoteLengthModal";

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

  useEffect(() => {
    connectAndSyncDoc("test");
    const yInstruments = getParts();
    yInstruments.observe((event) => {
      setParts([...getParts()]);
    });
  }, []);

  const openModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    partId: string,
    i: number,
    j: number
  ) => {
    e.preventDefault();
    setMousePos({ x: e.clientX, y: e.clientY });
    setContextSelectedCell({ partId, i, j });
  };

  useEffect(() => {
    const clickEventHandler = () => {
      setMousePos(null);
    };

    window.addEventListener("click", clickEventHandler);
    return () => {
      window.removeEventListener("click", clickEventHandler);
    };
  }, []);

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

  return (
    <div>
      {parts.map((partId) => {
        return (
          <InstrumentContainer
            key={partId}
            partId={partId}
            openModal={openModal}
          />
        );
      })}
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
