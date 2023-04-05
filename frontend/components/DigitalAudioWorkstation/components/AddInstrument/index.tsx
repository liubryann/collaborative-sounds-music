import React, { useState } from "react";
import styles from "./add-instrument.module.scss";
import { addPart } from "../../adapter";
import Modal from "../Modal";

interface AddInstrumentProps {
  pause: () => void;
}

export default function AddInstrument({ pause }: AddInstrumentProps) {
  const [partName, setPartName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleAddInstrument(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    pause();
    addPart(partName);
    setPartName("");
    setIsOpen(false);
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPartName(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        button={"Add Instrument"}
        modalHeader={"Enter the name for this part"}
      >
        <form onSubmit={handleAddInstrument} className={styles.form}>
          <input
            type="text"
            value={partName}
            onChange={handleOnChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </div>
  );
}
