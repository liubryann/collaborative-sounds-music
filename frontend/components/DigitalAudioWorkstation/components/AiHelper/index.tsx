import React, { useState, useRef } from "react";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import styles from "./ai-helper.module.scss";
import Modal from "../Modal";
import Dropdown from "@/components/Dropdown";
import { getChord, getProgression } from "@/services/ai-service";

export default function AiHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const noteOptions = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  const [majorNote, setMajorNote] = useState("C");
  const [minorNote, setMinorNote] = useState("C");

  const majorDropdownRef = useRef<HTMLDivElement>(null);
  const minorDropdownRef = useRef<HTMLDivElement>(null);

  function handleMajorSelection(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (
      majorDropdownRef.current &&
      !majorDropdownRef.current.contains(e.target as Node)
    ) {
      setAiThinking(true);
      getChord(majorNote, "major").then(({ result }) => {
        setAiThinking(false);
        setAiResponse(result);
      });
    }
  }

  function handleMinorSelection(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (
      minorDropdownRef.current &&
      !minorDropdownRef.current.contains(e.target as Node)
    ) {
      setAiThinking(true);
      getChord(minorNote, "minor").then(({ result }) => {
        setAiThinking(false);
        setAiResponse(result);
      });
    }
  }

  function handleProgressionSelection(type: string) {
    setAiThinking(true);
    getProgression(type).then(({ result }) => {
      setAiThinking(false);
      setAiResponse(result);
    });
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        button={
          <div className={styles.chatButton}>
            <BsFillChatLeftDotsFill
              style={{ fontSize: "1em", color: "#1377b9" }}
            />
            <span>Assistant</span>
          </div>
        }
        modalHeader={"Musical Assistant"}
      >
        <div className={styles.modalContent}>
          <div className={styles.selection} onClick={handleMajorSelection}>
            <span className={styles.selectionLabel}>
              What notes make up the
            </span>
            <span ref={majorDropdownRef}>
              <Dropdown
                items={noteOptions}
                selectedItem={majorNote}
                handleSelectItem={setMajorNote}
                wrapperStyle={styles.dropdown}
              />
            </span>
            <span className={styles.selectionLabel}> major chord?</span>
          </div>

          <div className={styles.selection} onClick={handleMinorSelection}>
            <span className={styles.selectionLabel}>
              What notes make up the
            </span>
            <span ref={minorDropdownRef}>
              <Dropdown
                items={noteOptions}
                selectedItem={minorNote}
                handleSelectItem={setMinorNote}
                wrapperStyle={styles.dropdown}
              />
            </span>
            <span className={styles.selectionLabel}> minor chord?</span>
          </div>

          <div
            onClick={(e) => handleProgressionSelection("chord")}
            className={styles.selection}
          >
            <span className={styles.selectionLabel}>
              Suggest a chord progression for this song
            </span>
          </div>

          <div
            onClick={(e) => handleProgressionSelection("rhythm")}
            className={styles.selection}
          >
            <span className={styles.selectionLabel}>
              Suggest a rhythm progression for this song
            </span>
          </div>

          <div className={styles.aiResponse}>
            {aiThinking ? <div>...</div> : <div>{aiResponse}</div>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
