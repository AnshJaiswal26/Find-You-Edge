import { useCallback } from "react";
import { useCalculatorStore, useSettingsStore } from "@RM/context";
import { useSyncOppositeSection, useValidateAndNotify } from "@RM/hooks";
import { getValBySecName, safe } from "@RM/utils";

export default function usePercentHandler() {
  const syncOppositeSection = useSyncOppositeSection();
  const validateAndNotify = useValidateAndNotify();

  const handlePercentChange = useCallback(
    (section, field, val) => {
      const capital = useCalculatorStore.getState().capital.current;
      const state = useSettingsStore.getState();
      const mode = state.derived.input;
      const adjust = state.derived.adjust;

      const isBuyLock = mode === "buyPrice";
      const isAmountLock = mode === "amount";
      const isBuyViaAmount = adjust === "buyPrice" && isAmountLock;

      const { name, sellPrice, buyPrice, qty } = section;

      const updatedPercent = getValBySecName(name, val);

      const updated = { percent: updatedPercent };
      updated.amount = capital * safe(updated.percent / 100);
      updated.pts = safe(updated.amount / qty);

      if (isBuyLock || isBuyViaAmount)
        updated.buyPrice = sellPrice - updated.pts;
      else updated.sellPrice = buyPrice + updated.pts;

      const isAnyInvalid = validateAndNotify(name, field, {
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
      });

      if (name !== "calculator" && !isAnyInvalid)
        syncOppositeSection({
          name: name,
          buyPrice: updated.buyPrice ?? buyPrice,
          pts: updated.pts,
          qty: qty,
        });

      return updated;
    },
    [syncOppositeSection, validateAndNotify]
  );
  return handlePercentChange;
}
