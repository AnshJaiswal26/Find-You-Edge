import styles from "./ButtonStyles.module.css";
export default function ToggleButton({
  label,
  toggleOn,
  color,
  onClick,
  bothSide = false,
  style,
}) {
  if (toggleOn !== null && toggleOn !== undefined) {
    const toggleStyle =
      toggleOn || bothSide ? { backgroundColor: color ?? "#007bff" } : {};
    const borderColor = toggleOn || bothSide ? color ?? "#007bff" : "#cccccc";

    return (
      <div className={styles.toggleBtnContainer} style={style}>
        {label?.[0] && (
          <span className={styles.toggleBtnLabel}>{label[0]}</span>
        )}
        <div
          className={styles.toggleBtnTrack}
          style={toggleStyle}
          onClick={() => {
            if (!onClick) return;
            onClick();
          }}
        >
          <div
            className={`${styles.toggleBtnCircle} ${
              toggleOn ? styles.toggleBtnEnable : ""
            }`}
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>
        {label?.[1] && (
          <span className={styles.toggleBtnLabel}>{label[1]}</span>
        )}
      </div>
    );
  }
}
