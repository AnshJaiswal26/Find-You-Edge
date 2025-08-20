import { useCallback } from "react";
import { logInfo, logResult, logStart, logSuccess } from "@RM/utils";
import { useRiskManagementStore } from "@RM/stores";

export default function useSpecialCaseHandler() {
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const handleSpecialCases = useCallback(
    (section, field, val, onBlur = false) => {
      const { name, prevVal } = section;
      logStart("handleSpecialCases");

      const isOnlyDot = val === ".";
      const isOnlyDash = val === "-";
      const isOnlyDotAtEnd = /^-?\d+\.$/.test(val);
      const hasOnlyTrailingZeros = /\d+\.(?:0+)$/.test(val);
      const isNegSignWithDotOrZero =
        val.startsWith("-.") || val.startsWith("0-");
      const isValidNumeric = /^-?\d*\.?\d*$/.test(val);

      const isNegField =
        name === "calculator" && ["pts", "amount", "percent"].includes(field);

      const update = (newValue, isPrevVal = false) => {
        logSuccess("Valid Special Case Found ", `'${val}'`);

        updateSection(
          name,
          {
            [field]: newValue,
            ...(isPrevVal &&
              !hasOnlyTrailingZeros && {
                prevVal: section[field],
              }),
          },
          { round: false }
        );

        logResult("handleSpecialCases", true);
        return true;
      };

      if (onBlur) {
        if (isOnlyDot) return update(0);
        if (val.endsWith(".") || hasOnlyTrailingZeros || isOnlyDash)
          return update(prevVal);
      }

      if (isNegField && isNegSignWithDotOrZero) return update("-");

      if (isOnlyDotAtEnd || hasOnlyTrailingZeros || isOnlyDash)
        return update(val, true);

      if (!isValidNumeric && val !== "") {
        logInfo("Invalid Special Case Found ", `${val}`);
        logResult("handleSpecialCases", true);
        return true;
      }

      logResult("handleSpecialCases", false);
      return false;
    },
    [updateSection]
  );

  return handleSpecialCases;
}
