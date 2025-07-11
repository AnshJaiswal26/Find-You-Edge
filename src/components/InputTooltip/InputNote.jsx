import React from "react";
import "./InputNote.css";

const InputNote = ({ message, down, show, style }) => {
  return (
    <div
      className={`tooltip-note${down ? "-down" : ""} ${show ? "show" : ""}`}
      style={style}
    >
      {message}
    </div>
  );
};

export default InputNote;
