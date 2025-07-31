import { useCallback } from "react";
import { useRiskCalculator } from "@RM/context";
import { useSyncOppositeSection } from "@RM/hooks";

export default function useRiskRewardHandler() {
  const { target, stopLoss, updateRiskCalculator } = useRiskCalculator();
  const syncOppositeSection = useSyncOppositeSection();
  const handleRiskRewardChange = useCallback(
    (section, field, val) => {
      const updatedRR = Math.max(0, val);
      const { buyPrice, pts, qty } = stopLoss;

      syncOppositeSection({
        name: "stopLoss",
        buyPrice: buyPrice,
        pts: pts,
        qty: qty,
        ratio: updatedRR,
      });

      updateRiskCalculator("riskReward", { ratio: updatedRR });

      return null;
    },
    [stopLoss, syncOppositeSection, updateRiskCalculator]
  );
  return handleRiskRewardChange;
}
