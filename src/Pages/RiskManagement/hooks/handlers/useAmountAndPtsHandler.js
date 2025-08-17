import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useValidateAndNotify, useSyncOppositeSection } from "@RM/hooks";
import { getValBySecName, safe } from "@RM/utils";

export default function useAmountAndPtsHandler() {
  const syncOppositeSection = useSyncOppositeSection();
  const validateAndNotify = useValidateAndNotify();

  const handleAmountOrPtsChange = useCallback(
    ({ section, field, val, sync = true }) => {
      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const derived = state.settings.derived;
      const mode = derived.input;

      const isBuyLock = mode === "buyPrice";
      const isAmountLock = mode === "amount";
      const isBuyViaAmount = derived.adjust === "buyPrice" && isAmountLock;

      const { name, buyPrice, sellPrice, qty } = section;

      const isPts = field === "pts";
      const value = getValBySecName(name, val);

      const updated = { pts: isPts ? value : safe(value / qty) };
      updated.amount = isPts ? value * qty : value;
      updated.percent = safe(updated.amount / capital) * 100;

      if (isBuyLock || isBuyViaAmount)
        updated.buyPrice = sellPrice - updated.pts;
      else updated.sellPrice = updated.pts + buyPrice;

      const isAnyInvalid = !sync
        ? validateAndNotify(name, field, {
            buyPrice: updated.buyPrice ?? buyPrice,
            sellPrice: updated.sellPrice ?? sellPrice,
          })
        : true;

      if (name !== "calculator" && sync && !isAnyInvalid)
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

  return handleAmountOrPtsChange;
}
