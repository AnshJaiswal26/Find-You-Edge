import { fieldLabels } from "../../../data/fieldData";

export default function CalculatedFields({
  affected,
  formulaMap,
  currentSection,
}) {
  const getFormulaBySection = (field) => {
    const oppoSec = currentSection === "Target" ? "SL" : "Target";
    const operator = currentSection === "Target" ? "×" : "/";

    if (affected.length === 6) {
      return field === "buyPrice" || field === "qty"
        ? `from ${oppoSec}`
        : field === "sellPrice"
        ? `Buy Price + (${oppoSec} Pts ${operator} Risk-Reward)`
        : `${oppoSec} ${fieldLabels[field]} ${operator} Risk-Reward`;
    } else return formulaMap[field];
  };

  return (
    <div>
      <div className="section-title calc-title">
        🧮 Calculated Inputs ({affected.length}){" "}
        {currentSection && "in " + currentSection}
      </div>
      <div className="flex column gap10">
        {affected.map((field) => (
          <div className="field-card calc-card">
            <div className="field-name">{fieldLabels[field]}</div>
            <div className="field-note">Auto-calculated</div>

            <div className="formula-box">
              <div className="formula-label">Formula:</div>
              <div className="formula-value">{getFormulaBySection(field)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
