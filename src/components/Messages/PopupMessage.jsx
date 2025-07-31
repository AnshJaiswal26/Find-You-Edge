import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import "./PopupMessage.css";

export default function PopupMessage({
  message,
  type = "info",
  duration = 4000,
  onClose,
  isVisible,
  showCloseButton = true,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, handleClose]);

  const getTypeConfig = useMemo(() => {
    switch (type) {
      case "success":
        return {
          className: "popup-success",
          icon: CheckCircle,
        };
      case "error":
        return {
          className: "popup-error",
          icon: XCircle,
        };
      case "warn":
        return {
          className: "popup-warning",
          icon: AlertTriangle,
        };
      default:
        return {
          className: "popup-info",
          icon: Info,
        };
    }
  }, [type]);

  const { className, icon: Icon } = getTypeConfig;

  if (!isVisible) return null;

  return (
    <>
      <div className="popup-container">
        <div
          className={`popup-message ${className} ${
            isAnimating ? "animate-in" : ""
          }`}
        >
          <Icon className="popup-icon" />
          <p className="popup-text">{message}</p>
          {showCloseButton && (
            <button onClick={handleClose} className="popup-close">
              <X className="popup-close-icon" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
