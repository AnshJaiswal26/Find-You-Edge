import { useCallback } from "react";
import { logInfo, logResult, logStart, logSuccess } from "@RM/utils";
import { useRiskManagementStore } from "@RM/stores";

export default function useSpecialCaseHandler() {
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const handleSpecialCases = useCallback(
    (section, field, val, onBlur = false) => {
      logStart("handleSpecialCases", {
        section,
        field,
        val,
        onBlur,
      });

      const specialCases = {
        isOnlyDot: val === ".",
        isOnlyDash: val === "-",
        isOnlyDotAtEnd: /^-?\d+\.$/.test(val),
        hasOnlyTrailingZeros: /\d+\.(?:0+)$/.test(val),
        isNegSignWithDotOrZero: val.startsWith("-.") || val.startsWith("0-"),
        isNegField:
          section.name === "calculator" &&
          ["pts", "amount", "percent"].includes(field),
      };

      const {
        isOnlyDot,
        isOnlyDash,
        isOnlyDotAtEnd,
        hasOnlyTrailingZeros,
        isNegSignWithDotOrZero,
        isNegField,
      } = specialCases;

      const update = (newValue, isPrevVal = false) => {
        logStart("update", { newValue, isPrevVal });
        logSuccess("Valid Special Case Found ", `'${val}'`);

        if (section.name !== "pyramiding") {
          updateSection(
            section.name,
            {
              [field]: newValue,
              ...(isPrevVal && {
                prevVal: hasOnlyTrailingZeros
                  ? section.prevVal
                  : section[field],
              }),
            },
            { round: false }
          );
        }

        logResult("update", true);
        logResult("handleSpecialCases", true);
        return true;
      };

      if (onBlur) {
        if (isOnlyDot) return update(0);
        if (val.endsWith(".") || hasOnlyTrailingZeros || isOnlyDash)
          return update(section.prevVal);
      }

      if (isNegField && isNegSignWithDotOrZero) return update("-");

      if (isOnlyDotAtEnd || hasOnlyTrailingZeros || isOnlyDash)
        return update(val, true);

      const isValidNumeric = /^-?\d*\.?\d*$/.test(val);

      if (!isValidNumeric && val !== "") {
        logInfo("Invalid Special Case Found ", `'${val}'`);
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
