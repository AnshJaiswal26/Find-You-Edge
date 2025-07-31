import { useCallback, useRef } from "react";
import {
  useNotification,
  useCalculator,
  useNote,
  useRiskCalculator,
  useTransaction,
} from "@RM/context";
import { useUpdater } from "@RM/hooks";
import { getNewCharges, safe } from "@RM/utils";

export default function useChargesLogic() {
  const { calculator } = useCalculator();
  const { transaction } = useTransaction();
  const { capital, riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();
  const { updateTransaction, updateSection } = useUpdater();
  const { showMsg } = useNotification();
  const { showNote } = useNote();

  const isProcessing = useRef(false);

  const toggleCharges = useCallback(
    (section, field) => {
      const { name, buyPrice, sellPrice, qty, pts, amount, percent } = section;

      const isAdd = field === "added";

      showMsg("charges", field, true);

      const baseCharges = getNewCharges(section, 0);
      const adjustCharges = isAdd
        ? getNewCharges(section, baseCharges)
        : baseCharges;
      const newCharges = safe(isAdd ? adjustCharges : -adjustCharges);

      const changeInPts = safe(newCharges / qty);
      const changeInPercent = safe((newCharges / capital.current) * 100);

      const updated = {
        sellPrice: safe(sellPrice + changeInPts),
        pts: safe(pts + changeInPts),
        amount: safe(amount + newCharges),
        percent: capital ? safe(percent + changeInPercent) : 0,
      };

      updateSection(name, updated, true);

      if (name.includes(transaction.currentSection.name.slice(-4)))
        updateTransaction({
          buyPrice: buyPrice,
          sellPrice: updated.sellPrice,
          qty: qty,
        });

      return updated.amount;
    },
    [showMsg, transaction, capital, updateSection, updateTransaction]
  );

  const charges = useCallback(
    (field) => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      let targetAmt = 0,
        slAmt = 0;
      [target, stopLoss, calculator].forEach((section) => {
        const { name, qty } = section;
        if (qty !== 0) {
          const amount = toggleCharges(section, field);

          if (name === "target") targetAmt = amount;
          else if (name === "stopLoss") slAmt = amount;
        }
      });

      const isTargetOrSl = transaction.currentSection.name !== "Calculator";

      if (isTargetOrSl && slAmt !== 0) {
        updateRiskCalculator("riskReward", {
          ratio: safe(targetAmt / -slAmt, 2),
          prevRatio: riskReward.ratio,
        });

        field === "added"
          ? showNote("riskReward", "ratio", true)
          : showNote("riskReward", "ratio", false);
      }

      setTimeout(() => {
        isProcessing.current = false;
      }, 300);
    },
    [
      toggleCharges,
      target,
      stopLoss,
      calculator,
      transaction,
      riskReward,
      updateRiskCalculator,
      showNote,
    ]
  );

  return { charges };
}
