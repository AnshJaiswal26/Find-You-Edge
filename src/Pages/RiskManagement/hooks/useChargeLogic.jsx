import { useCallback, useRef } from "react";
import {
  useNotification,
  useCalculatorStore,
  useTooltipStore,
} from "@RM/context";
import { getNewCharges, safe } from "@RM/utils";

export default function useChargesLogic() {
  const currentTransaction = useCalculatorStore((s) => s.currentTransaction);
  const capital = useCalculatorStore((s) => s.capital.current);
  const ratio = useCalculatorStore((s) => s.riskReward.ratio);
  const showNote = useTooltipStore((s) => s.showNote);
  const updateSection = useCalculatorStore((s) => s.updateSection);
  const { showMsg } = useNotification();

  const isProcessing = useRef(false);

  const toggleCharges = useCallback(
    (secName, field) => {
      const section = useCalculatorStore.getState()[secName];
      const { name, sellPrice, qty, pts, amount, percent } = section;

      if (qty === 0) return 0;

      const isAdd = field === "added";

      showMsg("charges", field, true);

      const baseCharges = getNewCharges(section, 0);
      const adjustCharges = isAdd
        ? getNewCharges(section, baseCharges)
        : baseCharges;
      const newCharges = safe(isAdd ? adjustCharges : -adjustCharges);

      const changeInPts = safe(newCharges / qty);
      const changeInPercent = safe(newCharges / capital) * 100;

      const updated = {
        sellPrice: sellPrice + changeInPts,
        pts: pts + changeInPts,
        amount: amount + newCharges,
        percent: capital !== 0 ? percent + changeInPercent : 0,
      };

      updateSection(name, updated);

      return updated.amount;
    },
    [showMsg, capital, updateSection]
  );

  const charges = useCallback(
    (field) => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      let targetAmt = 0,
        slAmt = 0;
      ["target", "stopLoss", "calculator"].forEach((secName) => {
        const amount = toggleCharges(secName, field);
        if (amount !== 0) {
          if (secName === "target") targetAmt = amount;
          else if (secName === "stopLoss") slAmt = amount;
        }
      });

      const isTargetOrSl = currentTransaction !== "Calculator";

      if (isTargetOrSl && slAmt !== 0) {
        updateSection("riskReward", {
          ratio: safe(targetAmt / -slAmt, 2),
          prevRatio: ratio,
        });

        field === "added"
          ? showNote("riskReward", "ratio", true)
          : showNote("riskReward", "ratio", false);
      }

      setTimeout(() => {
        isProcessing.current = false;
      }, 300);
    },
    [toggleCharges, currentTransaction, ratio, updateSection, showNote]
  );

  return { charges };
}
