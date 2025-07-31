import { useNote, useRiskCalculator, useSettings } from "@RM/context";
import { useSyncOppositeSection, useVerifyInput } from "@RM/hooks";
import { safe } from "@RM/utils";
import { useCallback } from "react";

export default function useQtyHandler() {
  const { capital } = useRiskCalculator();
  const syncOppositeSection = useSyncOppositeSection();
  const { settings } = useSettings();
  const verifyValues = useVerifyInput();

  const isAmountLock = settings.derived.mode === "amount";
  const isBuyLock = settings.derived.mode === "buyPrice";

  const handleQtyChange = useCallback(
    (section, field, val) => {
      const { name, buyPrice, sellPrice, pts, amount } = section;

      const updatedQty = Math.max(0, val);
      const updated = { qty: updatedQty };

      if (isAmountLock) {
        updated.amount = pts * updatedQty;
        updated.percent = safe(updated.amount / capital.current) * 100;
      } else {
        updated.pts = safe(amount / updatedQty);
        if (isBuyLock) updated.buyPrice = sellPrice - updated.pts;
        else updated.sellPrice = buyPrice + updated.pts;
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
          qty: updatedQty,
        });

      return {
        section: updated,
        transaction: {
          buyPrice: updated.buyPrice ?? buyPrice,
          sellPrice: updated.sellPrice ?? sellPrice,
          qty: updatedQty,
        },
      };
    },
    [capital, isAmountLock, isBuyLock, syncOppositeSection, verifyValues]
  );
  return handleQtyChange;
}
