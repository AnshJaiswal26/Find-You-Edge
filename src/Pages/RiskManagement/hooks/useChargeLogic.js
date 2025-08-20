import { useCallback, useRef } from "react";
import { useNotification, useRiskManagementStore } from "@RM/stores";
import { getNewCharges, safe } from "@RM/utils";

export default function useChargesLogic() {
  const { showMsg } = useNotification();
  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const isProcessing = useRef(false);

  const toggleCharges = useCallback(
    (secName, field, capital) => {
      const section = useRiskManagementStore.getState()[secName];
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
    [showMsg, updateSection]
  );

  const charges = useCallback(
    (field) => {
      const state = useRiskManagementStore.getState();
      const currentTransaction = state.currentTransaction;
      const capital = state.capital.current;
      const ratio = state.riskReward.ratio;

      if (isProcessing.current) return;
      isProcessing.current = true;

      let targetAmt = 0,
        slAmt = 0;
      ["target", "stopLoss", "calculator"].forEach((secName) => {
        const amount = toggleCharges(secName, field, capital);
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
          ? showTooltip("riskReward", true)
          : showTooltip("riskReward", false);
      }

      setTimeout(() => {
        isProcessing.current = false;
      }, 300);
    },
    [toggleCharges, showTooltip, updateSection]
  );

  return charges;
}
