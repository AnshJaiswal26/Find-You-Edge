import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useValidateAndSync } from "@RM/hooks";
import { getValBySecName, safe } from "@RM/utils";

export default function usePtsAmountAndPercentHandler() {
  const validateAndSync = useValidateAndSync();

  const handlePtsAmountAndPercentChange = useCallback(
    ({ section, field, val, isFormatting = false }) => {
      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const { input, adjust } = state.settings.derived;

      const isAmountLock = input === "amount";
      const isBuyLock =
        input === "buyPrice" || (adjust === "buyPrice" && isAmountLock);

      const { name, buyPrice, sellPrice, qty } = section;

      const isPts = field === "pts";
      const isAmt = field === "amount";
      const value = getValBySecName(name, val);

      const newAmount = isPts
        ? value * qty
        : isAmt
        ? value
        : capital * safe(value / 100);

      const newPts = isPts ? value : safe(newAmount / qty);
      const newPercent = safe(newAmount / capital) * 100;

      const newBuyPrice = isBuyLock ? sellPrice - newPts : buyPrice;
      const newSellPrice = !isBuyLock ? buyPrice + newPts : sellPrice;

      const syncUpdates = !isFormatting
        ? validateAndSync({
            name,
            field,
            buyPrice: newBuyPrice,
            sellPrice: newSellPrice,
            pts: newPts,
            qty,
          })
        : {};

      return {
        [name]: {
          buyPrice: newBuyPrice,
          sellPrice: newSellPrice,
          pts: newPts,
          amount: newAmount,
          percent: newPercent,
        },
        ...syncUpdates,
      };
    },
    [validateAndSync]
  );

  return handlePtsAmountAndPercentChange;
}
