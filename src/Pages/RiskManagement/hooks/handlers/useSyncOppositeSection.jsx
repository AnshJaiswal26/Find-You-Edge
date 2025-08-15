import { useCallback } from "react";
import { getPtsByRatio, logResult, logStart, safe } from "@RM/utils";
import { useValidateAndNotify } from "..";
import { useCalculatorStore } from "@RM/context";

export default function useSyncOppositeSection() {
  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);
  const validateAndNotify = useValidateAndNotify();

  const syncOppositeSection = useCallback(
    (current) => {
      const rrRatio = useCalculatorStore.getState().riskReward.ratio;
      const capital = useCalculatorStore.getState().capital.current;

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
