import { useCallback } from "react";
import { useCalculatorStore } from "@RM/context";
import { safe } from "@RM/utils";

export default function useCapitalHandler() {
  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);

  const handleCapitalChange = useCallback(
    (section, field, numericValue) => {
      const calculatorAmt = useCalculatorStore.getState().calculator.amount;
      const targetAmt = useCalculatorStore.getState().target.amount;
      const stopLossAmt = useCalculatorStore.getState().stopLoss.amount;

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
