import { useCallback } from "react";
import { useSyncOppositeSection } from "@RM/hooks";
import { useCalculatorStore } from "@RM/context";

export default function useRiskRewardHandler() {
  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);

  const syncOppositeSection = useSyncOppositeSection();
  const handleRiskRewardChange = useCallback(
    (section, field, val) => {
      const stopLoss = useCalculatorStore.getState().stopLoss;

      const updatedRR = Math.max(0, val);

      syncOppositeSection({
        name: "stopLoss",
        field: "pts",
        buyPrice: stopLoss.buyPrice,
        pts: stopLoss.pts,
        qty: stopLoss.qty,
        ratio: updatedRR,
      });

      updateSection("riskReward", { ratio: updatedRR });

      return null;
    },
    [syncOppositeSection, updateSection]
  );
  return handleRiskRewardChange;
}
