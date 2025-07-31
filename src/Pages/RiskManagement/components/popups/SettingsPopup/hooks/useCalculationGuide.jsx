import { useMemo } from "react";
import { useSettings } from "@RM/context";

export default function useCalculationGuide() {
  const { settings } = useSettings();

  const derivedField = useMemo(() => settings.derived.mode, [settings]);
  const selectedField = useMemo(() => settings.guide.selectedField, [settings]);

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

  const fields = useMemo(
    () => ["buyPrice", "sellPrice", "qty", "pts", "amount", "percent"],
    []
  );

  const mainFields = useMemo(
    () =>
      settings.selectedSection === "Target" ||
      settings.selectedSection === "Stop-Loss"
        ? ["riskReward", ...fields]
        : fields,
    [settings, fields]
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
    () => ({
      buyPrice: "Sell Price - Pts",
      sellPrice: "Buy Price + Pts",
      pts: selectedField.includes("Price")
        ? "Sell Price - Buy Price"
        : "Amount / Qty",
      amount:
        selectedField === "percent" ? "Capital × (Pnl (%) / 100)" : "Pts × Qty",
      percent: "(Amount / Capital) × 100",
    }),
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
