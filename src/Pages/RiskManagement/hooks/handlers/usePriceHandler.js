import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useSyncOppositeSection, useValidateAndNotify } from "@RM/hooks";
import { getDerivedObj, logError, logResult, logStart, safe } from "@RM/utils";

export default function usePriceHandler() {
  const syncOppositeSection = useSyncOppositeSection();
  const validateAndNotify = useValidateAndNotify();

  const handlePriceChange = useCallback(
    ({ section, field, val }) => {
      logStart("handlePriceChange", { section, field, val });

      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const derivedInput = state.settings.derived.input;

      const { name, buyPrice, sellPrice, qty, pts } = section;
      const isBuyPrice = field === "buyPrice";
      const price = Math.max(0, val);

      const updated = getDerivedObj(section, price, isBuyPrice, derivedInput);

      updated[field] = price;

      if (updated.pts !== undefined && updated.pts !== null) {
        updated.amount = safe(updated.pts * qty);
        updated.percent = safe((updated.amount / capital) * 100);
      }

      const isAnyInvalid = validateAndNotify(name, field, {
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
        prevBuy: buyPrice,
        prevSell: sellPrice,
      });

      if (isAnyInvalid) {
        logError(
          `Invalid input tooltip triggered ${
            name !== "calculator" ? "and skipping opposite section update" : ""
          }.`
        );
      }

      if (name !== "calculator" && !isAnyInvalid) {
        console.log("%c🔄 Syncing opposite section...", "color: #a855f7;");
        syncOppositeSection({
          name,
          field,
          buyPrice: updated.buyPrice ?? buyPrice,
          pts: updated.pts ?? pts,
          qty,
        });
      }

      logResult("handlePriceChange", updated);
      return updated;
    },
    [syncOppositeSection, validateAndNotify]
  );

  return handlePriceChange;
}
