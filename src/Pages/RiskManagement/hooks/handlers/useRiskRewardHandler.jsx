import { useRiskCalculator } from "../../context/context";
import { useAmountAndPtsHandler } from "./useAmountAndPtsHandler";

export function useRiskRewardHandler() {
  const { target, stopLoss, updateRiskCalculator } = useRiskCalculator();
  const handleAmountOrPtsChange = useAmountAndPtsHandler();

  function handleRiskRewardChange(section, field, val, isRecursive = false) {
    const updatedRR = Math.max(0, val);

    const updated = handleAmountOrPtsChange(
      target,
      "pts",
      stopLoss.pts * -updatedRR,
      true
    );
    updateRiskCalculator("target", updated);
    updateRiskCalculator("riskReward", { ratio: updatedRR });
    return null;
  }
  return handleRiskRewardChange;
}
