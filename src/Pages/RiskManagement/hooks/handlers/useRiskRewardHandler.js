import { useCallback } from "react";
import { useSyncOppositeSection } from "@RM/hooks";
import { useRiskManagementStore } from "@RM/stores";

export default function useRiskRewardHandler() {
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const syncOppositeSection = useSyncOppositeSection();
  const handleRiskRewardChange = useCallback(
    ({ val }) => {
      const stopLoss = useRiskManagementStore.getState().stopLoss;

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
