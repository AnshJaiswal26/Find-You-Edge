import { useCallback } from "react";
import { useRiskCalculator } from "@RM/context";
import { getPtsByRatio, safe } from "@RM/utils";

export default function useSyncOppositeSection() {
  const { riskReward, capital, updateRiskCalculator } = useRiskCalculator();
  const syncOppositeSection = useCallback(
    (current) => {
      const { name, buyPrice, pts, qty, ratio } = current;

      const isTarget = name === "target";
      const oppoSec = isTarget ? "stopLoss" : "target";

      const sync = {
        pts: safe(getPtsByRatio(isTarget, pts, ratio ?? riskReward.ratio)),
      };

      sync.buyPrice = buyPrice;
      sync.sellPrice = buyPrice + sync.pts;
      sync.qty = qty;
      sync.amount = sync.pts * qty;
      sync.percent = safe(sync.amount / capital.current) * 100;

      updateRiskCalculator(oppoSec, sync);
    },
    [riskReward, capital, updateRiskCalculator]
  );

  return syncOppositeSection;
}
