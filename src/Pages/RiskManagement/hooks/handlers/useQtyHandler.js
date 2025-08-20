import { useRiskManagementStore } from "@RM/stores";
import { useValidateAndSync } from "@RM/hooks";
import { safe } from "@RM/utils";
import { useCallback } from "react";

export default function useQtyHandler() {
  const validateAndSync = useValidateAndSync();

  const handleQtyChange = useCallback(
    ({ section, field, val }) => {
      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const derivedInput = state.settings.derived.input;

      const isAmountLock = derivedInput === "amount";
      const isBuyLock = derivedInput === "buyPrice";

      const { name, buyPrice, sellPrice, pts, amount } = section;
      const newQty = Math.abs(parseInt(val));
      const updated = { qty: newQty };

      if (isAmountLock) {
        updated.amount = pts * newQty;
        updated.percent = safe(updated.amount / capital) * 100;
      } else {
        updated.pts = safe(amount / newQty);
        if (isBuyLock) updated.buyPrice = sellPrice - updated.pts;
        else updated.sellPrice = buyPrice + updated.pts;
      }

      const syncUpdates = validateAndSync({
        name,
        field,
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
        pts,
        qty: newQty,
      });

      return { [name]: updated, ...syncUpdates };
    },
    [validateAndSync]
  );
  return handleQtyChange;
}
