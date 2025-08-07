import { useCallback } from "react";
import { useUpdater } from "@RM/hooks";

export default function useSpecialCaseHandler() {
  const { updateSection } = useUpdater();

  const handleSpecialCases = useCallback(
    (section, field, val, onBlur = false) => {
      console.groupCollapsed(
        `%c${onBlur ? "(On Blur) " : ""}[SpecialCaseHandler] ${
          section.name
        } → ${field}: ${val}`,
        "color: #ff8763ff;"
      );

      const isDot = val === ".";
      const isDash = val === "-";
      const hasTrailingZerosOrDot = /^-?\d+\.$|^-?\d+\.0{1,4}$/.test(val);
      const hasOnlyTrailingZeros = /\d+\.(?:0+)$/.test(val);
      const isNegFormat = val.startsWith("-.") || val.startsWith("0-");
      const isNegField =
        section.name === "calculator" &&
        ["pts", "amount", "percent"].includes(field);

      console.log("isDot:", isDot);
      console.log("isDash:", isDash);
      console.log("hasTrailingZerosOrDot:", hasTrailingZerosOrDot);
      console.log("hasOnlyTrailingZeros:", hasOnlyTrailingZeros);
      console.log("isNegFormat:", isNegFormat);
      console.log("isNegField:", isNegField);

      const update = (newValue, isPrevVal = false) => {
        console.log(
          "%c⚠ Special case detected - skipping numeric update.",
          "background: #b35900ff; padding: 5px; border-radius: 3px; font-weight: bold;"
        );
        console.log("%c[update] → [updateSection]", "color: #ff8763ff;");
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

        console.groupEnd();
        return true;
      };

      console.log("onBlur:", onBlur);
      if (onBlur) {
        if (isDot) return update(0);
        if (val.endsWith(".") || hasOnlyTrailingZeros || isDash)
          return update(section.prevVal);
      }

      if (isNegField && isNegFormat) return update("-");

      if (hasTrailingZerosOrDot || isDash) return update(val, true);

      const isValidNumeric = /^-?\d*\.?\d*$/.test(val);
      if (!isValidNumeric && val !== "") {
        console.log(
          "%c⚠ Special case detected - skipping numeric update.",
          "background: #b35900ff; padding: 5px; border-radius: 3px;"
        );
        console.groupEnd();
        return true;
      }

      console.groupEnd();
      return false;
    },
    [updateSection]
  );

  return handleSpecialCases;
}
