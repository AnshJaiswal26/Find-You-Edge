import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useFieldHandler, useSpecialCaseHandler } from "@RM/hooks";
import { generateTooltip, logInfo, logResult, logStart } from "@RM/utils";

const checkValues = (field, val) => {
  let Max_Val = 100 * 10000000,
    isValid;
  if (field === "pts" || field === "percent") isValid = val <= 10000;
  else if (field === "amount" || field === "capital") isValid = val <= Max_Val;
  else if (field === "ratio") isValid = val <= 100;
  else val <= 100000;
};

export default function useInputChange() {
  const handleSpecialCases = useSpecialCaseHandler();
  const handlers = useFieldHandler();

  const updateSections = useRiskManagementStore((s) => s.update.sections);
  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);

  const handleChange = useCallback(
    (sectionName, field, val) => {
      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const section = state[sectionName];

      logStart("handleInputChange", { section, field, val });

      const value = field === "ratio" ? val.replace("1 : ", "") : val;
      field === "ratio" && logInfo("Processed value for ratio", value);

      const isSpecialCaseFound = handleSpecialCases(section, field, value);

      if (isSpecialCaseFound) {
        logResult("handleInputChange", "Special Case Found.");
        return;
      }

      const prev = section[field];
      const numericValue = value === "" ? 0 : Number(value);

      if (prev === numericValue) {
        logResult("handleInputChange", "No Change Found - skipping update.");
        return;
      }

      if ((capital === 0 && field === "percent") || field === "riskPercent") {
        const tooltip = generateTooltip(field, "zeroCapital");
        showTooltip("capitalTooltip", { current: tooltip });
        logResult("handleInputChange", "Capital is Zero");
        return;
      }

      const updates = handlers[field]({ section, field, val: numericValue });
      if (updates) updateSections(updates);

      logResult("handleInputChange", `Process Done for ${section.name}.`);
    },
    [handlers, handleSpecialCases, updateSections, showTooltip]
  );

  return handleChange;
}
