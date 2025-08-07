import { fieldLabels } from "../../../../../../data/fieldData";

export default function Summary({
  affected,
  fields,
  selectedField,
  currentSection,
}) {
  const isTargetOrSl =
    currentSection === "Target" || currentSection === "Stop-Loss";
  const oppositeSection = currentSection === "Target" ? "Stop-Loss" : "Target";

  return (
    <div className="summary-box">
      <div className="summary-text">
        Change in{" "}
        <span className="highlight-input">{fieldLabels[selectedField]}</span> in{" "}
        {currentSection}→{" "}
        <span className="highlight-calc">
          {affected.map((field) => fieldLabels[field]).join(", ")}
        </span>{" "}
        {affected.length < 2 ? "is" : "are"} Auto-Calculated.
      </div>
      <div className="summary-text">
        {isTargetOrSl && selectedField !== "riskReward" && (
          <span className="summary-text">
            Auto-Calculated inputs in {oppositeSection}→{" "}
            <span className="highlight-calc">
              {fields.map((field) => fieldLabels[field]).join(", ")}
            </span>{" "}
          </span>
        )}
      </div>
    </div>
  );
}
