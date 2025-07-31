import { useCallback } from "react";
import { useCalculator, useRiskCalculator } from "@RM/context";
import { safe } from "@RM/utils";

export default function useCapitalHandler() {
  const { target, stopLoss, updateRiskCalculator } = useRiskCalculator();
  const { calculator, updateCalculator } = useCalculator();

  const handleCapitalChange = useCallback(
    (section, field, numericValue) => {
      const newCapital = Math.max(0, numericValue);

      const updated = {
        calcPer: safe((calculator.amount / newCapital) * 100),
        targetPer: safe((target.amount / newCapital) * 100),
        sLPer: safe((stopLoss.amount / newCapital) * 100),
      };

      updateCalculator("calculator", { percent: updated.calcPer });
      updateRiskCalculator("target", { percent: updated.targetPer });
      updateRiskCalculator("stopLoss", { percent: updated.sLPer });

      updateRiskCalculator("capital", { current: newCapital });
      return null;
    },
    [target, stopLoss, calculator, updateCalculator, updateRiskCalculator]
  );
  return handleCapitalChange;
}
