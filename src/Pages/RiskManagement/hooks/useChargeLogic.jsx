import { useRef } from "react";
import {
  useNotification,
  useCalculator,
  useNote,
  useRiskCalculator,
  useTransaction,
} from "../context/context";
import { getNewCharges } from "../utils/utils";
import { useRefiners } from "./useRefiners";

export function useChargesLogic() {
  const { calculator, updateCalculator } = useCalculator();
  const { transaction, updateTransaction } = useTransaction();
  const { capital, riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();
  const { showMsg } = useNotification();
  const { refine, round } = useRefiners();
  const { timeOut } = useNote();

  const isProcessing = useRef(false);

  const getFormatterAndUpdater = (name) => {
    const isCalc = name === "calculator";
    return {
      formatter: isCalc ? refine : round,
      updateSection: isCalc ? updateCalculator : updateRiskCalculator,
    };
  };

  function toggleCharges(section, field) {
    const { name, sellPrice, pts, amount, percent } = section;

    const isAdd = field === "added";

    showMsg("charges", field);

    const { formatter, updateSection } = getFormatterAndUpdater(name);

    const baseCharges = getNewCharges(section, 0);
    const adjustCharges = isAdd
      ? getNewCharges(section, baseCharges)
      : baseCharges;
    const newCharges = formatter(isAdd ? adjustCharges : -adjustCharges);

    const changeInPts = formatter(newCharges / section.qty);
    const changeInPercent = formatter((newCharges / capital.current) * 100, 0);

    const updated = {
      sellPrice: formatter(sellPrice + changeInPts),
      pts: formatter(pts + changeInPts),
      amount: formatter(amount + newCharges),
      percent: capital ? formatter(percent + changeInPercent, 0) : 0,
    };

    updateSection(section.name, updated);

    if (section.name.includes(transaction.currentSection.name.slice(-4)))
      updateTransaction({
        buyPrice: section.buyPrice,
        sellPrice: updated.sellPrice,
        qty: section.qty,
      });

    return updated.amount;
  }

  const charges = (field) => {
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

    const isNonCalculatorSection =
      transaction.currentSection.name !== "Calculator";

    if (isNonCalculatorSection && slAmt !== 0) {
      updateRiskCalculator("riskReward", {
        ratio: round(targetAmt / -slAmt, 0),
        prevRatio: riskReward.ratio,
      });

      timeOut(
        "riskReward",
        "ratio",
        field === "added" ? 7000 : 0,
        field !== "added"
      );
    }

    setTimeout(() => {
      isProcessing.current = false;
    }, 600);
  };

  return { charges };
}
