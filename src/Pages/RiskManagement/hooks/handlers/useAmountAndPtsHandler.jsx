import { useRiskCalculator, useNote } from "../../context/context";
import { getValBySecName, getPtsByRatio } from "../../utils/utils";
import { useRefiners } from "../useRefiners";

export function useAmountAndPtsHandler() {
  const { getFormatter } = useRefiners();
  const { showNote } = useNote();
  const { capital, riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();

  function handleAmountOrPtsChange(section, field, val, isRecursive = false) {
    console.info(
      `handleAmountOrPtsChange Called for section=${section.name} ${
        isRecursive ? "(Rucursive Call)" : ""
      } val=${val}`
    );

    const { name, buyPrice, qty } = section;
    const isTarget = name === "target";
    const oppositeSection = isTarget ? stopLoss : target;
    const formatter = getFormatter(name);

    const isPts = field === "pts";
    const newValue = val;
    const value = getValBySecName(name, newValue);

    const updated = {
      pts: isPts ? formatter(value) : formatter(value / qty),
    };
    updated.amount = isPts ? formatter(value * qty) : formatter(value);
    updated.sellPrice = formatter(updated.pts + buyPrice);
    updated.percent = formatter((updated.amount / capital) * 100, 0);

    showNote(name, isTarget ? "greater" : "less", updated.pts === 0);
    if (isRecursive) return updated;
    else if (name !== "calculator") {
      updateRiskCalculator(
        oppositeSection.name,
        handleAmountOrPtsChange(
          oppositeSection,
          field,
          getPtsByRatio(isTarget, value, riskReward.ratio),
          true
        )
      );
    }

    return {
      section: updated,
      transaction: {
        sellPrice: updated.sellPrice,
      },
    };
  }

  return handleAmountOrPtsChange;
}
