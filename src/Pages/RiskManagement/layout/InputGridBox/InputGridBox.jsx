import styles from "./InputGridBox.module.css";
export default function CalculatorInputBox({
  children,
  className,
  elementWidth,
}) {
  return (
    <div style={{ "--grid-width": elementWidth ? elementWidth : "130px" }}>
      <div className={`${styles.calculatorGrid} ${className}`}>{children}</div>
    </div>
  );
}
