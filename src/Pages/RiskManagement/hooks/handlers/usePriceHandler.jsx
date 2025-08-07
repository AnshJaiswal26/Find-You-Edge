import { useCallback } from "react";
import { useRiskCalculator, useSettings } from "@RM/context";
import { useSyncOppositeSection, useValidateAndNotify } from "@RM/hooks";
import { getDerivedObj, safe } from "@RM/utils";

export default function usePriceHandler() {
  const { capital } = useRiskCalculator();
  const syncOppositeSection = useSyncOppositeSection();
  const { settings } = useSettings();
  const validateAndNotify = useValidateAndNotify();

  const derivedField = settings.derived.mode;

  const handlePriceChange = useCallback(
    (section, field, val) => {
      console.groupCollapsed(
        `%c[PriceHandler] ${section.name} → ${field}: ${val}`,
        "color: #d3ff63ff; font-weight: bold;"
      );

      const { name, buyPrice, sellPrice, qty, pts } = section;
      const isBuyPrice = field === "buyPrice";

      const price = Math.max(0, val);
      console.log("Normalized price:", price);

      const updated = getDerivedObj(section, price, isBuyPrice, derivedField);

      updated[field] = price;
      console.log(`Updated → Updated + ${field}:`, updated);

      if (updated.pts !== undefined && updated.pts !== null) {
        updated.amount = safe(updated.pts * qty);
        updated.percent = safe((updated.amount / capital.current) * 100);
        console.log(`Updated → Updated + amount:`, updated);
        console.log(`Updated → Updated + percent:`, updated);
      }

      const isAnyInvalid = validateAndNotify(name, field, {
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
      });

      if (isAnyInvalid) {
        console.log("Validation result: ❌ Invalid");
        console.warn(" Invalid input, skipping sync & transaction.");
        console.groupEnd();
        return { section: updated };
      } else {
        console.log("Validation result: ✅ Valid");
      }

      if (name !== "calculator") {
        console.log("%c🔄 Syncing opposite section...", "color: #a855f7;");
        syncOppositeSection({
          name,
          field,
          buyPrice: updated.buyPrice ?? buyPrice,
          pts: updated.pts ?? pts,
          qty,
        });
      }

      const result = {
        section: updated,
        transaction: {
          buyPrice: updated.buyPrice ?? buyPrice,
          sellPrice: updated.sellPrice ?? sellPrice,
          qty,
        },
      };

      console.log("[PriceHandler] result:", result);
      console.groupEnd();
      return result;
    },
    [syncOppositeSection, validateAndNotify, capital, derivedField]
  );

  return handlePriceChange;
}
