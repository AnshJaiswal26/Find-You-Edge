import { useCallback } from "react";
import { useUpdater } from "@RM/hooks";

export default function useInputValidator() {
  const { updateSection } = useUpdater();

  const handleSpecialCases = useCallback(
    (section, field, val, onBlur = false) => {
      const numericValue = Number(val.replace("1 : ", ""));

      const isDot = val === ".";
      const isDash = val === "-";
      const hasTrailingZerosOrDot = /^-?\d+\.$|^-?\d+\.0{1,4}$/.test(val);
      const hasOnlyTrailingZeros = /\d+\.(?:0+)$/.test(val);
      const isNegFormat = val.startsWith("-.") || val.startsWith("0-");
      const isNegField =
        section.name === "calculator" &&
        ["pts", "amount", "percent"].includes(field);

      const update = (newValue, isPrevVal = false) => {
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
        } else {
          const row = section.table.rows[section.currentLayer];
          if ((row[field] = newValue)) return true;
          const updatedRow = {
            [field]: newValue,
          };
          updateSection(
            "pyramiding",
            {
              table: {
                ...section.table,
                rows: section.table.rows.map((r, i) =>
                  i === section.currentLayer ? { ...r, ...updatedRow } : r
                ),
              },
              ...(isPrevVal && {
                prevVal: hasOnlyTrailingZeros ? section.prevVal : row[field],
              }),
            },
            false
          );
        }
        return true;
      };

      if (onBlur)
        return update(
          isDot
            ? 0
            : val.endsWith(".") || hasOnlyTrailingZeros || isDash
            ? section.prevVal
            : numericValue
        );

      if (isNegField && isNegFormat) return update("-");

      if (hasTrailingZerosOrDot || isDash) return update(val, true);

      if (!/^-?\d*\.?\d*$/.test(val) && val !== "") return true;

      return false;
    },
    [updateSection]
  );

  return handleSpecialCases;
}
