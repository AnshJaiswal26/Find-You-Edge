import { useMemo } from "react";
import { useSettings } from "@RM/context";
import { fields } from "@RM/data";
import { getFormulaMap } from "@RM/utils";

export default function useCalculationGuide() {
  const { settings } = useSettings();

  const derivedField = settings.derived.mode;
  const selectedField = settings.guide.selectedField;
  const currentSection = settings.selectedSection;

  const isAmountLock = useMemo(() => derivedField === "amount", [derivedField]);
  const isBuyLock = useMemo(() => derivedField === "buyPrice", [derivedField]);

  const commonField = useMemo(
    () => (isBuyLock ? "buyPrice" : "sellPrice"),
    [isBuyLock]
  );

  const remainingCommonField = useMemo(
    () => (isBuyLock ? "sellPrice" : "buyPrice"),
    [isBuyLock]
  );

  const mainFields = useMemo(
    () =>
      currentSection === "Target" || currentSection === "Stop-Loss"
        ? ["riskReward", ...fields]
        : fields,
    [currentSection]
  );

  const commonAffectedFields = useMemo(() => {
    return {
      [commonField]: ["pts", "amount", "percent"],
      [remainingCommonField]: isAmountLock
        ? ["pts", "amount", "percent"]
        : [commonField],
      qty: isAmountLock ? ["amount", "percent"] : ["pts", derivedField],
      pts: ["amount", "percent", commonField],
      amount: ["pts", "percent", commonField],
      percent: ["amount", "pts", commonField],
      riskReward: ["sellPrice", "pts", "amount", "percent"],
    };
  }, [commonField, remainingCommonField, isAmountLock, derivedField]);

  const affected = useMemo(
    () => commonAffectedFields[selectedField],
    [commonAffectedFields, selectedField]
  );

  const userDefined = useMemo(
    () => mainFields.filter((field) => !affected.includes(field)),
    [mainFields, affected]
  );

  const formulaMap = useMemo(
    () => getFormulaMap(selectedField),
    [selectedField]
  );

  return {
    affected,
    userDefined,
    selectedField,
    fields,
    mainFields,
    formulaMap,
  };
}
