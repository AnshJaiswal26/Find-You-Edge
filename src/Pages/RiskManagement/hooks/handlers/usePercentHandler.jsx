import { useCallback } from "react";
import { useRiskCalculator, useNote, useSettings } from "@RM/context";
import { useSyncOppositeSection, useValidateAndNotify } from "@RM/hooks";
import { getValBySecName, safe } from "@RM/utils";

export default function usePercentHandler() {
  const { capital } = useRiskCalculator();
  const syncOppositeSection = useSyncOppositeSection();
  const { settings } = useSettings();
  const validateAndNotify = useValidateAndNotify();

  const isBuyLock = settings.derived.mode === "buyPrice";
  const isAmountLock = settings.derived.mode === "amount";
  const isBuyViaAmount =
    settings.amount.changesIn === "buyPrice" && isAmountLock;

  const handlePercentChange = useCallback(
    (section, field, val) => {
      const { name, sellPrice, buyPrice, qty } = section;

      const updatedPercent = getValBySecName(name, val);

      const updated = { percent: updatedPercent };
      updated.amount = capital.current * safe(updated.percent / 100);
      updated.pts = safe(updated.amount / qty);

      if (isBuyLock || isBuyViaAmount)
        updated.buyPrice = sellPrice - updated.pts;
      else updated.sellPrice = buyPrice + updated.pts;

      const isAnyInvalid = validateAndNotify(name, field, {
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
      });

      if (isAnyInvalid) return { section: updated };

      if (name !== "calculator")
        syncOppositeSection({
          name: name,
          buyPrice: updated.buyPrice ?? buyPrice,
          pts: updated.pts,
          qty: qty,
        });

      return {
        section: updated,

        transaction: {
          sellPrice: updated.sellPrice ?? sellPrice,
          buyPrice: updated.buyPrice ?? buyPrice,
        },
      };
    },
    [capital, isBuyLock, isBuyViaAmount, syncOppositeSection, validateAndNotify]
  );
  return handlePercentChange;
}
