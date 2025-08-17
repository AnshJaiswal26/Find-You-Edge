import { ButtonSelector } from "@components";
import {
  Arrow,
  CalculatedFields,
  InputFields,
  ManualInputs,
  Summary,
} from "./GuideComponents";
import { useCalculationGuide } from "@RM/hooks";
import { fields } from "@RM/data";
import { useMemo } from "react";
import { useRiskManagementStore } from "@RM/stores";

export default function CalculationLogicGuide({ updateSettings }) {
  const { selectedField, affected, userDefined, mainFields, formulaMap } =
    useCalculationGuide();

  const selectedSection = useRiskManagementStore(
    (s) => s.settings.selectedSection
  );

  const isTargetOrSl = useMemo(
    () => selectedSection === "Target" || selectedSection === "Stop-Loss",
    [selectedSection]
  );

  return (
    <>
      <ButtonSelector
        label={"Calculation Logic Guide:"}
        options={["Calculator", "Target", "Stop-Loss", "Position-Sizing"]}
        onSelect={(mode) => updateSettings("selectedSection", mode)}
        selectedOption={selectedSection}
        size="small"
      />
      {/* Dependencies Visualization */}
      <div className="settings-popup-grid">
        <InputFields
          selectedField={selectedField}
          updateSettings={updateSettings}
          mainFields={mainFields}
        />
        <Arrow selectedField={selectedField} />
        <ManualInputs userDefined={userDefined} />
        <CalculatedFields
          affected={affected}
          formulaMap={formulaMap}
          currentSection={selectedSection}
        />
        {isTargetOrSl && (
          <CalculatedFields
            affected={fields}
            formulaMap={formulaMap}
            currentSection={
              selectedSection === "Target" ? "Stop-Loss" : "Target"
            }
          />
        )}{" "}
      </div>

      <Summary
        affected={affected}
        selectedField={selectedField}
        currentSection={selectedSection}
      />
    </>
  );
}
