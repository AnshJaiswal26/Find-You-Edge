import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from "lucide-react";
import "./ValidationTooltip.css";

export default function ValidationTooltip({
  message,
  type = "error",
  isVisible,
  position = "top",
  onClose,
  autoHide = true,
  duration = 5000,
  showCloseButton = false,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      if (autoHide) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, autoHide, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose && onClose();
    }, 200);
  };

  const getTooltipConfig = () => {
    switch (type) {
      case "error":
        return {
          className: "tooltip-error",
          icon: AlertCircle,
          bgColor: "#dc2626",
          borderColor: "#ef4444",
        };
      case "warning":
        return {
          className: "tooltip-warning",
          icon: AlertTriangle,
          bgColor: "#d97706",
          borderColor: "#f59e0b",
        };
      case "success":
        return {
          className: "tooltip-success",
          icon: CheckCircle,
          bgColor: "#059669",
          borderColor: "#10b981",
        };
      case "info":
        return {
          className: "tooltip-info",
          icon: Info,
          bgColor: "#2563eb",
          borderColor: "#3b82f6",
        };
      default:
        return {
          className: "tooltip-error",
          icon: AlertCircle,
          bgColor: "#dc2626",
          borderColor: "#ef4444",
        };
    }
  };

  const { className, icon: Icon } = getTooltipConfig();

  if (!isVisible) return null;

  return (
    <>
      <div className={`validation-tooltip tooltip-${position} ${className}`}>
        <div className={`tooltip-content ${isAnimating ? "animate-in" : ""}`}>
          <Icon className="tooltip-icon" />
          <p className="tooltip-message">{message}</p>
          {showCloseButton && (
            <button onClick={handleClose} className="tooltip-close">
              <X className="tooltip-close-icon" />
            </button>
          )}
        </div>
        <div className="tooltip-arrow"></div>
        <div className="tooltip-arrow-border"></div>
      </div>
    </>
  );
}
