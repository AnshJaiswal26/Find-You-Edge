import "./Tooltip.css";

export default function Tooltip({ data, position, isVisible }) {
  if (!data) return null;
  return (
    <div
      className={`info-tooltip-container info-tooltip-${position} ${
        isVisible ? "visible" : ""
      }`}
    >
      <div className="info-tooltip-content">
        {data.map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>
      <div className="info-tooltip-arrow"></div>
    </div>
  );
}
