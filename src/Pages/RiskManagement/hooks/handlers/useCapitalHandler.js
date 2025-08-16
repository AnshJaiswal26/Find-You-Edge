import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { safe } from "@RM/utils";

export default function useCapitalHandler() {
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const handleCapitalChange = useCallback(
    (section, field, numericValue) => {
      const { calculator, target, stopLoss } =
        useRiskManagementStore.getState();

      const calculatorAmt = calculator.amount;
      const targetAmt = target.amount;
      const stopLossAmt = stopLoss.amount;

      const newCapital = Math.max(0, numericValue);

      const updated = {
        calcPer: safe((calculatorAmt / newCapital) * 100),
        targetPer: safe((targetAmt / newCapital) * 100),
        sLPer: safe((stopLossAmt / newCapital) * 100),
      };

      updateSection("calculator", { percent: updated.calcPer });
      updateSection("target", { percent: updated.targetPer });
      updateSection("stopLoss", { percent: updated.sLPer });

      updateSection("capital", { current: newCapital });
      return null;
    },
    [updateSection]
  );
  return handleCapitalChange;
}
