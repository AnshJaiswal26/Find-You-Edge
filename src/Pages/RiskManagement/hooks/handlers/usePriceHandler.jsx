import { useCallback } from "react";
import { useRiskCalculator, useNote, useSettings } from "@RM/context";
import { useSyncOppositeSection, useVerifyInput } from "@RM/hooks";
import { getDerivedObj, safe } from "@RM/utils";

export default function usePriceHandler() {
  const { capital } = useRiskCalculator();
  const syncOppositeSection = useSyncOppositeSection();
  const { settings } = useSettings();
  const verifyValues = useVerifyInput();

  const derivedField = settings.derived.mode;

  const handlePriceChange = useCallback(
    (section, field, val) => {
      const { name, buyPrice, sellPrice, qty, amount, pts } = section;

      const isBuyPrice = field === "buyPrice";

      const price = Math.max(0, val);
      const updated = getDerivedObj(section, price, isBuyPrice, derivedField);

      updated[field] = price;
      if (updated.pts !== undefined || updated.pts !== null) {
        updated.amount = safe(updated.pts * qty);
        updated.percent = safe(updated.amount / capital.current) * 100;
      }

      const isAnyInvalid = verifyValues(name, field, {
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
      });

      if (isAnyInvalid) return { section: updated };

      if (name !== "calculator")
        syncOppositeSection({
          name: name,
          buyPrice: updated.buyPrice ?? buyPrice,
          pts: updated.pts ?? pts,
          qty: qty,
        });

      return {
        section: updated,
        transaction: {
          buyPrice: updated.buyPrice ?? buyPrice,
          sellPrice: updated.sellPrice ?? sellPrice,
          qty: qty,
        },
      };
    },
    [syncOppositeSection, verifyValues, capital, derivedField]
  );

  return handlePriceChange;
}
