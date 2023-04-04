import React from "react";
import styles from "./range-input.module.scss";

interface RangeInputProps {
  wrapperStyle?: string;
  value: string;
  min: string;
  max: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RangeInput({
  wrapperStyle,
  value,
  min,
  max,
  onChange,
}: RangeInputProps) {
  return (
    <div className={`${wrapperStyle} ${styles.wrapper}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className={styles.rangeInput}
      />
    </div>
  );
}
