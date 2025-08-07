import React from "react";
import styles from "./ButtonStyles.module.css";

export default function Button({ text, color, onClick, style, title }) {
  if (!text || typeof text !== "string")
    console.error("Text must be a non-empty string");

  const buttonStyle = {
    ...(color ? { backgroundColor: color } : {}),
    ...(style ? style : {}),
  };

  return (
    <div>
      <button
        style={buttonStyle}
        title={title}
        className={style?.disabled ? `${styles.disabled}` : styles.button}
        disabled={style?.disabled}
        onClick={() => {
          if (!onClick) return;
          onClick();
        }}
      >
        <span>{text}</span>
      </button>
    </div>
  );
}
