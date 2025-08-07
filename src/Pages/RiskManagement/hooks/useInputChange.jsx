import { useCallback } from "react";
import { useRiskCalculator, useNote } from "@RM/context";
import { useFieldHandler, useUpdater, useSpecialCaseHandler } from "@RM/hooks";
import { fieldLabels } from "@RM/data";

export default function useInputChange() {
  const handleSpecialCases = useSpecialCaseHandler();
  const handlers = useFieldHandler();
  const { capital } = useRiskCalculator();
  const { showNote } = useNote();
  const { updateSection, updateTransaction } = useUpdater();

  const checkValues = (section, field, val) => {
    let Max_Val = 100 * 10000000,
      isValid;
    if (field === "pts" || field === "percent") isValid = val <= 10000;
    else if (field === "amount" || field === "capital")
      isValid = val <= Max_Val;
    else if (field === "ratio") isValid = val <= 100;
    else val <= 100000;
  };

  const handleChange = useCallback(
    (section, field, val) => {
      console.groupCollapsed(
        `%c[InputChange] ${section.name} → ${field}: ${val}`,
        "color: #d3ff63ff; font-weight: bold;"
      );

      console.log("Raw input value:", val);

      const value = field === "ratio" ? val.replace("1 : ", "") : val;
      field === "ratio" && console.log("Processed input value:", value);

      const isSpecialCaseFound = handleSpecialCases(section, field, value);

      if (isSpecialCaseFound) {
        console.groupEnd();
        return;
      }

      const prev = section[field];
      const numericValue = value === "" ? 0 : Number(value);
      console.log("Converted numeric value:", numericValue);

      if (prev === numericValue) {
        console.log("No Change Found - skipping update.");
        console.groupEnd();
        return;
      }

      if (capital.current === 0 && field === "percent") {
        console.warn("Capital is zero and field is 'percent' — showing note.");
        showNote("capital", "current", true);
        console.groupEnd();
        return;
      }

      const updated = handlers[field](section, field, numericValue);

      if (updated?.section) {
        updateSection(section.name, updated.section, true);
      }

      if (updated?.transaction) {
        updateTransaction(updated.transaction);
      }

      console.groupEnd();
    },
    [
      handlers,
      handleSpecialCases,
      updateSection,
      updateTransaction,
      showNote,
      capital,
    ]
  );

  return handleChange;
}
