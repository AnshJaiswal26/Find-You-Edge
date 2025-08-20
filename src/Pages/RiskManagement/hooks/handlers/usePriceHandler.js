import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useValidateAndSync } from "@RM/hooks";
import { resolvePts, logResult, safe, logStart } from "@RM/utils";

export default function usePriceHandler() {
  const validateAndSync = useValidateAndSync();

  const handlePriceChange = useCallback(
    ({ section, field, val }) => {
      logStart("handlePriceChange");
      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const input = state.settings.derived.input;
      const isBuyLock = input === "buyPrice";
      const isAmountLock = input === "amount";
      const isSellLock = input === "sellPrice";

      const { name, buyPrice, sellPrice, qty, pts } = section;
      const isBuyPrice = field === "buyPrice";
      const price = Math.max(0, val);
      const updated = { [field]: price };

      isBuyLock && !isBuyPrice && (updated.buyPrice = price - pts);
      isSellLock && isBuyPrice && (updated.sellPrice = price + pts);

      const shouldCompute = input === field || isAmountLock;
      if (shouldCompute) {
        const diff = isBuyPrice ? sellPrice - price : price - buyPrice;
        updated.pts = resolvePts(name, pts, diff);
        updated.amount = safe(updated.pts * qty);
        updated.percent = safe((updated.amount / capital) * 100);
      }

      const syncUpdates = validateAndSync({
        name,
        field,
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
        pts,
        qty,
      });

      logResult("handlePriceChange", updated);
      return {
        [name]: updated,
        ...syncUpdates,
      };
    },
    [validateAndSync]
  );

  return handlePriceChange;
}
