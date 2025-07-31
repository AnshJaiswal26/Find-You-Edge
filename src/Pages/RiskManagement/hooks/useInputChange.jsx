import { useCallback } from "react";
import { useRiskCalculator, useNote } from "@RM/context";
import { useFieldHandler, useUpdater, useInputValidator } from "@RM/hooks";

export default function useInputChange() {
  const handleSpecialCases = useInputValidator();
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
      const value = field === "ratio" ? val.replace("1 : ", "") : val;
      const isInvalid = handleSpecialCases(section, field, value);

      console.log("isValid", isInvalid, value, field);
      if (isInvalid) return;

      const numericValue = value === "" ? 0 : Number(value);

      if (capital.current === 0 && field === "percent") {
        showNote("capital", "current", true);
        return;
      }

      const updated = handlers[field](section, field, numericValue);

      if (updated?.section) updateSection(section.name, updated.section, true);
      if (updated?.transaction) updateTransaction(updated.transaction);
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
