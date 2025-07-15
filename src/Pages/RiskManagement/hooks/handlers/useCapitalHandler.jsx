import { useCalculator, useRiskCalculator } from "../../context/context";
import { useRefiners } from "../hooks";

export function useCapitalHandler() {
  const { getFormatter } = useRefiners();
  const { target, stopLoss, updateRiskCalculator } = useRiskCalculator();
  const { calculator, updateCalculator } = useCalculator();

  function handleCapitalChange(
    section,
    field,
    numericValue,
    isRecursive = false
  ) {
    const refine = getFormatter("calculator");
    const newCapital = Math.max(0, numericValue);

    const updated = {
      calcPer: refine((calculator.amount / newCapital) * 100),
      targetPer: refine((target.amount / newCapital) * 100),
      sLPer: refine((stopLoss.amount / newCapital) * 100),
    };

    updateCalculator("calculator", { percent: updated.calcPer });
    updateRiskCalculator("target", { percent: updated.targetPer });
    updateRiskCalculator("stopLoss", { percent: updated.sLPer });

    updateRiskCalculator("capital", { current: newCapital });
    return null;
  }
  return handleCapitalChange;
}
