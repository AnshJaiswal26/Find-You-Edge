import { useCallback } from "react";
import { getPtsByRatio, logResult, logStart, safe } from "@RM/utils";
import { useValidateAndNotify } from "..";
import { useRiskManagementStore } from "@RM/stores";

export default function useSyncOppositeSection() {
  const updateSection = useRiskManagementStore((s) => s.update.section);
  const validateAndNotify = useValidateAndNotify();

  const syncOppositeSection = useCallback(
    (current) => {
      const state = useRiskManagementStore.getState();
      const rrRatio = state.riskReward.ratio;
      const capital = state.capital.current;

      const { name, field = "pts", buyPrice, pts, qty, ratio } = current;
      logStart("syncOppositeSection", { current });

      const isTarget = name === "target";
      const oppoSec = isTarget ? "stopLoss" : "target";

      const sync = {
        pts: safe(getPtsByRatio(isTarget, pts, ratio ?? rrRatio)),
      };

      sync.buyPrice = buyPrice;
      sync.sellPrice = buyPrice + sync.pts;
      sync.qty = qty;
      sync.amount = sync.pts * qty;
      sync.percent = safe(sync.amount / capital) * 100;

      validateAndNotify(oppoSec, field, sync);

      updateSection(oppoSec, sync);

      logResult("syncOppositeSection", "Process done for syncing.");
    },
    [updateSection, validateAndNotify]
  );

  return syncOppositeSection;
}
