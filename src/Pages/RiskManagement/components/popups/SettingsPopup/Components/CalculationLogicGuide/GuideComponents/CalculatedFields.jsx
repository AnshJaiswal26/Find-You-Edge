import { useCallback } from "react";
import { fieldLabels } from "@RM/data";
import { getFormula } from "@RM/utils";

export default function CalculatedFields({
  affected,
  formulaMap,
  currentSection,
}) {
  const createFormula = useCallback(
    (field) => getFormula(field, { currentSection, affected, formulaMap }),
    [currentSection, affected, formulaMap]
  );

  const isRRAndLengthIs6 =
    affected.length === 6 && formulaMap.name === "riskReward";

  return (
    <div>
      <div className="section-title calc-title">
        🧮 Calculated Inputs - {isRRAndLengthIs6 ? 0 : affected.length}{" "}
        {currentSection && "in (" + currentSection + ")"}
      </div>
      {isRRAndLengthIs6 ? (
        <div className="field-card calc-card"> Every Field Remains Same</div>
      ) : (
        <div className="flex column gap10">
          {affected.map((field) => (
            <div key={field} className="field-card calc-card">
              <div className="field-name">{fieldLabels[field]}</div>
              <div className="field-note">Auto-calculated</div>

              <div className="formula-box">
                <div className="formula-label">Formula:</div>
                <div className="formula-value">{createFormula(field)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
