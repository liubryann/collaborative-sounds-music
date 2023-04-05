import React, { useState } from "react";
import styles from "./dropdown.module.scss";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { IconContext } from "react-icons";

interface DropdownProps {
  wrapperStyle?: string;
  label?: string;
  selectedItem: string;
  handleSelectItem: (item: string) => void;
  items: string[];
}

export default function Dropdown({
  wrapperStyle,
  label,
  selectedItem,
  handleSelectItem,
  items,
}: DropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <IconContext.Provider value={{ size: "1em" }}>
      <div className={wrapperStyle}>
        {label && <span className={styles.label}>{label}</span>}
        <div
          className={styles.modifier}
          style={{ zIndex: showDropdown ? 5 : 3 }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className={styles.modifierNameContainer}>
            <span className={styles.modifierName}>{selectedItem}</span>
            {showDropdown ? <AiOutlineUp /> : <AiOutlineDown />}
          </div>
          {showDropdown && (
            <ul className={styles.list}>
              {items
                .filter((item) => item !== selectedItem)
                .map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        handleSelectItem(item);
                        setShowDropdown(false);
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </IconContext.Provider>
  );
}
