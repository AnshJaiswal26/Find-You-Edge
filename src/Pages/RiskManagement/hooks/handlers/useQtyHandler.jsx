import { useCalculatorStore, useSettingsStore } from "@RM/context";
import { useSyncOppositeSection, useValidateAndNotify } from "@RM/hooks";
import { safe } from "@RM/utils";
import { useCallback } from "react";

export default function useQtyHandler() {
  const syncOppositeSection = useSyncOppositeSection();
  const validateAndNotify = useValidateAndNotify();

  const handleQtyChange = useCallback(
    (section, field, val) => {
      const capital = useCalculatorStore.getState().capital.current;
      const derivedInput = useSettingsStore.getState().derived.input;

      const isAmountLock = derivedInput === "amount";
      const isBuyLock = derivedInput === "buyPrice";

      const { name, buyPrice, sellPrice, pts, amount } = section;
      const updatedQty = Math.max(0, val);
      const updated = { qty: updatedQty };

      if (isAmountLock) {
        updated.amount = pts * updatedQty;
        updated.percent = safe(updated.amount / capital) * 100;
      } else {
        updated.pts = safe(amount / updatedQty);
        if (isBuyLock) updated.buyPrice = sellPrice - updated.pts;
        else updated.sellPrice = buyPrice + updated.pts;
      }

      const isAnyInvalid = validateAndNotify(name, field, {
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
      });

      if (name !== "calculator" && !isAnyInvalid)
        syncOppositeSection({
          name: name,
          field: field,
          buyPrice: updated.buyPrice ?? buyPrice,
          pts: updated.pts ?? pts,
          qty: updatedQty,
        });

      return updated;
    },
    [syncOppositeSection, validateAndNotify]
  );
  return handleQtyChange;
}
