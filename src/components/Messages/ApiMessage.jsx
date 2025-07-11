import React, { useEffect, useState } from "react";
import "./MessageStyles.css"; // Common styles for messages

const ApiMessage = ({ message, type, icon, timer }) => {
  const [isVisible, setIsVisible] = useState(true); // Track visibility of the message

  const iconSrc =
    icon ||
    (type === "success"
      ? "Icons/others/check.png"
      : type === "error"
      ? "Icons/others/mark.png"
      : "Icons/others/info.png");

  useEffect(() => {
    if (timer !== null) {
      const timeout = setTimeout(() => setIsVisible(false), timer * 1000); // Hide message after timer seconds
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [timer]);

  if (!isVisible) return null; // Do not render if the message is not visible

  return (
    <div className={`api-message ${type}`}>
      <img src={iconSrc} alt={type} className="api-message-icon" />
      <span>{message}</span>
    </div>
  );
};

export default ApiMessage;
