import { useCallback } from "react";
import { useRiskCalculator, useSettings } from "@RM/context";
import { useVerifyInput, useSyncOppositeSection } from "@RM/hooks";
import { cleanFloat, getValBySecName, safe } from "@RM/utils";

export default function useAmountAndPtsHandler() {
  const { capital } = useRiskCalculator();
  const syncOppositeSection = useSyncOppositeSection();
  const { settings } = useSettings();
  const verifyValues = useVerifyInput();

  const isBuyLock = settings.derived.mode === "buyPrice";
  const isAmountLock = settings.derived.mode === "amount";
  const isBuyViaAmount =
    settings.amount.changesIn === "buyPrice" && isAmountLock;

  const handleAmountOrPtsChange = useCallback(
    (section, field, val) => {
      const { name, buyPrice, sellPrice, qty } = section;

      const isPts = field === "pts";
      const value = getValBySecName(name, val);

      const updated = { pts: isPts ? value : safe(value / qty) };
      updated.amount = isPts ? value * qty : value;
      updated.percent = safe(updated.amount / capital.current) * 100;

      if (isBuyLock || isBuyViaAmount)
        updated.buyPrice = cleanFloat(sellPrice - updated.pts);
      else updated.sellPrice = cleanFloat(updated.pts + buyPrice);

      const isAnyInvalid = verifyValues(name, field, {
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
    [syncOppositeSection, verifyValues, capital, isBuyLock, isBuyViaAmount]
  );

  return handleAmountOrPtsChange;
}
