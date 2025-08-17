import styles from "./Tooltip.module.css";

export default function Tooltip({ data, position, isVisible }) {
  if (!data) return null;
  return (
    <div
      className={`${styles.container} ${styles[position]} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.tooltipContent}>
        {data.map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>
      <div className={styles.arrow}></div>
    </div>
  );
}
