import React from "react";
import "./ButtonStyles.css";

function Button({ text, color, onClick, style, toggleOn, bothSide }) {
  if (toggleOn !== null && toggleOn !== undefined) {
    const toggleStyle =
      (color && toggleOn) || bothSide ? { backgroundColor: color } : {};
    const borderColor = (color && toggleOn) || bothSide ? color : "#cccccc";

    return (
      <div
        className="track"
        style={toggleStyle}
        onClick={() => {
          if (!onClick) return;
          onClick();
        }}
      >
        <div
          className={`track-circle ${toggleOn ? "enable" : ""}`}
          style={{ border: `1px solid ${borderColor}` }}
        />
      </div>
    );
  }

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
        className={style?.disabled ? " disabled" : "x-button"}
        disabled={style?.disabled}
        onClick={(e) => {
          if (!onClick) return;
          onClick();
        }}
      >
        <span>{text}</span>
      </button>
    </div>
  );
}

export default Button;
