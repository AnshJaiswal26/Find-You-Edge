import { useCallback } from "react";
import { useTooltipStore } from "@RM/context";
import {
  cleanFloat,
  generateTooltip,
  is,
  logResult,
  logStart,
} from "@RM/utils";

export default function useValidateAndNotify() {
  const showNote = useTooltipStore((s) => s.showNote);

  const validateAndNotify = useCallback(
    (name, field, obj) => {
      logStart("validateAndNotify", { name, field, obj });

      const prev = useTooltipStore.getState()[name];

      const buyPrice = cleanFloat(obj.buyPrice);
      const sellPrice = cleanFloat(obj.sellPrice);

      const isTargetOrSl = is.TOrSl(name);
      const opposite = is.oFL(field);
      const isBuyPrice = field === "buyPrice";
      const updated = {};

      const isBuyNeg = buyPrice < 0;
      const isSellNeg = sellPrice < 0;
      const isBuyGreater = buyPrice > sellPrice && name === "target";
      const isSellGreater = buyPrice < sellPrice && name === "stopLoss";
      const isAnyInvalid =
        isBuyNeg || isSellNeg || isBuyGreater || isSellGreater;

      const fields = [
        ["buyPrice", isBuyNeg],
        ["sellPrice", isSellNeg],
      ];

      for (const [f, isNeg] of fields) {
        const isPrevNull = prev[f] === null;
        if (isPrevNull && isNeg) {
          updated[f] = generateTooltip(f, "negative");
        } else if (!isPrevNull && !isNeg && prev[f].key.startsWith("n")) {
          updated[f] = null;
        }
      }

      if (isTargetOrSl && is.BS(field)) {
        const label1 = isBuyPrice && isBuyGreater ? "less" : "greater";
        const label2 = isBuyPrice && isSellGreater ? "greater" : "less";
        const key = name === "target" ? label1 : label2;

        if (isBuyGreater || isSellGreater) {
          prev[field] === null &&
            (updated[field] = generateTooltip(field, key));
        } else {
          prev[field] !== null && (updated[field] = null);
          prev[opposite] !== null && (updated[opposite] = null);
        }
      }

      if (Object.keys(updated).length > 0) {
        showNote(name, updated);
      }

      logResult("validateAndNotify", isAnyInvalid);
      return isAnyInvalid;
    },
    [showNote]
  );

  return validateAndNotify;
}
