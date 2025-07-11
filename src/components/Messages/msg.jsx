import React from "react";
import "./MessageStyles.css";

function Message({ text, show }) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        left: 0,
        top: "80px",
      }}
    >
      <div className={`message ${show ? "show" : ""}`}>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Message;
