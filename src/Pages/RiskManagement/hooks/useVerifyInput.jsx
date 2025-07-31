import { useCallback } from "react";
import { useNote, useSettings } from "@RM/context";
import { cleanFloat } from "@RM/utils";

export default function useVerifyInput() {
  const { note, showNote, showNoteInBatch } = useNote();
  const { settings } = useSettings();

  const derivedField = settings.derived.mode;

  const verifyValues = useCallback(
    (name, field, obj) => {
      const buyPrice = cleanFloat(obj.buyPrice);
      const sellPrice = cleanFloat(obj.sellPrice);

      const isBuyPrice = field === "buyPrice";
      const isBuyOrSell = isBuyPrice || field === "sellPrice";
      const opposite = derivedField === "buyPrice" ? "sellPrice" : "buyPrice";
      const updated = {};
      let flag = false;

      const sectionRules = {
        target: {
          condition: buyPrice > sellPrice,
          label: isBuyPrice ? "buyPriceLesser" : "sellPriceGreater",
          labels: ["buyPriceLesser", "sellPriceGreater"],
        },
        stopLoss: {
          condition: buyPrice < sellPrice,
          label: isBuyPrice ? "buyPriceGreater" : "sellPriceLesser",
          labels: ["buyPriceGreater", "sellPriceLesser"],
        },
      };
      const rule = sectionRules[name];

      if (derivedField === "amount") {
        const isBuyNeg = buyPrice < 0;
        const isSellNeg = sellPrice < 0;

        showNote(name, "buyPriceNeg", isBuyNeg);
        showNote(name, "sellPriceNeg", isSellNeg);
        showNote(name, field, isBuyNeg || isSellNeg);
        if (isBuyNeg || isSellNeg) flag = true;
      } else {
        if (note[name][opposite + "Neg"]) updated[opposite + "Neg"] = false;

        const isInvalid = obj[derivedField] < 0;
        updated[derivedField + "Neg"] = isInvalid;
        updated[field] = isInvalid;
        if (isInvalid) flag = true;
      }

      if (rule) {
        const { condition, label, labels } = rule;
        const isInvalid = condition;

        labels.forEach((key) => {
          const shouldShow = !isBuyOrSell || key === label;
          updated[key] = shouldShow && isInvalid;
        });

        if (isInvalid) flag = true;
      }

      if (Object.keys(updated).length > 0) showNoteInBatch(name, updated);
      return flag;
    },
    [showNote, showNoteInBatch, derivedField]
  );

  return verifyValues;
}
