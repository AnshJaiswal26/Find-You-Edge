import styles from "./CalculatorGridBox.module.css";
export default function CalculatorGridBox({
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
