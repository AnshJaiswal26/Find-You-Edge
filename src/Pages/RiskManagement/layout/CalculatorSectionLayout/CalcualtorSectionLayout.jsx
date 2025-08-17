import { sectionColor, sectionLabels } from "@RM/data";
import styles from "./CalculatorSection.module.css";
import { InputGridBox } from "..";

export default function CalculatorSectionLayout({
  name,
  headerElement,
  otherElement,
  onMouseEnter,
  inputGrid,
  children,
}) {
  return (
    <div className={styles.sections} onMouseEnter={() => onMouseEnter(name)}>
      <div className={styles.heading}>
        <span className={sectionColor?.[name]}>{sectionLabels?.[name]}</span>
        {headerElement}
      </div>
      {otherElement}
      {inputGrid && <InputGridBox>{inputGrid}</InputGridBox>}
      {children}
    </div>
  );
}
