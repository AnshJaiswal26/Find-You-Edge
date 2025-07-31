import { useState } from "react";
import "./Overview.css";

export default function Overview({
  title,
  pointsArray,
  withNote = false,
  note,
}) {
  const [showOverview, setShowOverview] = useState(false);

  return (
    <>
      <div>
        <button
          className={`overview-button ${showOverview ? "" : "show"}`}
          onClick={() => setShowOverview(!showOverview)}
        >
          <span className="overview-btn-text">
            {showOverview ? "Hide" : "See"} Overview
          </span>
          <span className="overview-btn-icon">
            {" "}
            {showOverview ? "🔼" : "🔽"}
          </span>
        </button>
      </div>

      <div className={`explanation-wrapper ${showOverview ? "show" : ""}`}>
        <div className="explanation-box">
          <div className="explanation-title">{title}</div>
          <ul className="explanation-points">
            {pointsArray.map((point, idx) => (
              <li key={idx} className="point-item">
                {point}
              </li>
            ))}
          </ul>
          {withNote && <div className="overview-note">{note}</div>}
        </div>
      </div>
    </>
  );
}
