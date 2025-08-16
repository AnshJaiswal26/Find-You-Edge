import { useMemo } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { fields } from "@RM/data";
import { getFormulaMap } from "@RM/utils";

export default function useCalculationGuide() {
  const derivedInput = useRiskManagementStore((s) => s.settings.derived.input);
  const selectedField = useRiskManagementStore(
    (s) => s.settings.logicGuide.selectedField
  );
  const selectedSection = useRiskManagementStore(
    (s) => s.settings.selectedSection
  );

  const isAmountLock = useMemo(() => derivedInput === "amount", [derivedInput]);
  const isBuyLock = useMemo(() => derivedInput === "buyPrice", [derivedInput]);

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
      selectedSection === "Target" || selectedSection === "Stop-Loss"
        ? ["riskReward", ...fields]
        : fields,
    [selectedSection]
  );

  const commonAffectedFields = useMemo(() => {
    return {
      [commonField]: ["pts", "amount", "percent"],
      [remainingCommonField]: isAmountLock
        ? ["pts", "amount", "percent"]
        : [commonField],
      qty: isAmountLock ? ["amount", "percent"] : ["pts", derivedInput],
      pts: ["amount", "percent", commonField],
      amount: ["pts", "percent", commonField],
      percent: ["amount", "pts", commonField],
      riskReward: ["sellPrice", "pts", "amount", "percent"],
    };
  }, [commonField, remainingCommonField, isAmountLock, derivedInput]);

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
