import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import {
  cleanFloat,
  generateTooltip,
  is,
  logResult,
  logStart,
} from "@RM/utils";

export default function useValidateAndNotify() {
  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);

  const validateAndNotify = useCallback(
    (name, field, obj) => {
      logStart("validateAndNotify", { name, field, obj });

      const prev = useRiskManagementStore.getState().tooltip[name];

      const buyPrice = cleanFloat(obj.buyPrice);
      const sellPrice = cleanFloat(obj.sellPrice);

      const isTargetOrSl = is.TOrSl(name);
      const opposite = is.oFL(field);
      const isBuyPrice = field === "buyPrice";
      const updated = {};

      const isBuyNeg = buyPrice < 0;
      const isSellNeg = sellPrice < 0;
      const isBuyGreater = buyPrice > sellPrice && name === "target";
      const isBuySmaller = buyPrice < sellPrice && name === "stopLoss";
      const isAnyInvalid =
        isBuyNeg || isSellNeg || isBuyGreater || isBuySmaller;

      const fields = [
        ["buyPrice", isBuyNeg],
        ["sellPrice", isSellNeg],
      ];

      for (const [f, isNeg] of fields) {
        const isPrevNull = prev?.[f] === null;
        if (isPrevNull && isNeg) {
          updated[f] = generateTooltip(f, "negative");
        } else if (!isPrevNull && !isNeg && prev[f].key.startsWith("n")) {
          updated[f] = null;
        }
      }

      if (isTargetOrSl && is.BS(field)) {
        const label1 = isBuyPrice && isBuyGreater ? "less" : "greater";
        const label2 = isBuyPrice && isBuySmaller ? "greater" : "less";
        const key = name === "target" ? label1 : label2;
        const prevKey = prev[field]?.key;

        if (isBuyGreater || isBuySmaller) {
          prev[field] === null &&
            (updated[field] = generateTooltip(field, key));
        } else if (
          prevKey &&
          (prevKey.startsWith("l") || prevKey.startsWith("g"))
        ) {
          prev[field] !== null && (updated[field] = null);
          prev[opposite] !== null && (updated[opposite] = null);
        }
      }

      if (Object.keys(updated).length > 0) {
        showTooltip(name, updated);
      }

      logResult("validateAndNotify", isAnyInvalid);
      return isAnyInvalid;
    },
    [showTooltip]
  );

  return validateAndNotify;
}
