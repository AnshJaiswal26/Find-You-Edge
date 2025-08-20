import { useCallback } from "react";
import { getPtsByRatio, safe } from "@RM/utils";
import { useValidateAndNotify } from "..";
import { useRiskManagementStore } from "@RM/stores";

export default function useSyncOppositeSection() {
  const validateAndNotify = useValidateAndNotify();

  const syncOppositeSection = useCallback(
    (current) => {
      const state = useRiskManagementStore.getState();
      const rrRatio = state.riskReward.ratio;
      const capital = state.capital.current;

      const { name, field = "pts", buyPrice, pts, qty, ratio } = current;

      const isTarget = name === "target";
      const oppoSec = isTarget ? "stopLoss" : "target";

      const newPts = safe(getPtsByRatio(isTarget, pts, ratio ?? rrRatio));

      const sync = {
        pts: newPts,
        buyPrice: buyPrice,
        sellPrice: buyPrice + newPts,
        qty: qty,
        amount: newPts * qty,
        percent: safe((newPts * qty) / capital) * 100,
      };

      const invalids = validateAndNotify(oppoSec, field, sync);

      return {
        [oppoSec]: sync,
        ...(invalids || {}),
      };
    },
    [validateAndNotify]
  );

  return syncOppositeSection;
}
