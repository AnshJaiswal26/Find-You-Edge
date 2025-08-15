import { useCallback } from "react";
import { useCalculatorStore, useTooltipStore } from "@RM/context";
import { useFieldHandler, useSpecialCaseHandler } from "@RM/hooks";
import { logInfo, logResult, logStart } from "@RM/utils";

export default function useInputChange() {
  const handleSpecialCases = useSpecialCaseHandler();
  const handlers = useFieldHandler();

  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);
  const showNote = useTooltipStore((cxt) => cxt.showNote);

  const checkValues = (field, val) => {
    let Max_Val = 100 * 10000000,
      isValid;
    if (field === "pts" || field === "percent") isValid = val <= 10000;
    else if (field === "amount" || field === "capital")
      isValid = val <= Max_Val;
    else if (field === "ratio") isValid = val <= 100;
    else val <= 100000;
  };

  const handleChange = useCallback(
    (sectionName, field, val) => {
      // console.time("handleInputChange");
      const state = useCalculatorStore.getState();
      const capital = state.capital.current;
      const section = state[sectionName];

      logStart("handleInputChange", { section, field, val });

      const value = field === "ratio" ? val.replace("1 : ", "") : val;
      field === "ratio" && logInfo("Processed value for ratio", value);

      const isSpecialCaseFound = handleSpecialCases(section, field, value);

      if (isSpecialCaseFound) {
        logResult("handleInputChange", "Special Case Found.");
        // console.timeEnd("handleInputChange");
        return;
      }

      const prev = section[field];
      const numericValue = value === "" ? 0 : Number(value);

      if (prev === numericValue) {
        logResult("handleInputChange", "No Change Found - skipping update.");
        // console.timeEnd("handleInputChange");

        return;
      }

      if (capital === 0 && field === "percent") {
        showNote("capital", "zeroCapital");
        // console.timeEnd("handleInputChange");
        logResult(
          "handleInputChange",
          "Capital is Zero - skipping update and showing note."
        );

        return;
      }

      const sectionUpdates = handlers[field](section, field, numericValue);

      if (sectionUpdates) updateSection(section.name, sectionUpdates);

      logResult("handleInputChange", `Process Done for ${section.name}.`);
      // console.timeEnd("handleInputChange");
    },
    [handlers, handleSpecialCases, updateSection, showNote]
  );

  return handleChange;
}
