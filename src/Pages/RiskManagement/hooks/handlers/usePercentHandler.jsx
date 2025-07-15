import { useRefiners } from "../useRefiners";
import { getPtsByRatio, getValBySecName } from "../../utils/utils";

import { useRiskCalculator, useNote } from "../../context/context";

export function usePercentHandler() {
  const { getFormatter } = useRefiners();
  const { showNote } = useNote();
  const { capital, riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();

  function handlePercentChange(section, field, val, isRecursive = false) {
    const { name, buyPrice, qty } = section;

    const isTarget = name === "target";
    const oppositeSection = isTarget ? stopLoss : target;
    const formatter = getFormatter(name);

    const updatedPercent = getValBySecName(name, val);

    const updated = {
      percent: formatter(updatedPercent, 0),
    };
    updated.amount = formatter(capital.current * (updated.percent / 100));
    updated.pts = formatter(updated.amount / qty);
    updated.sellPrice = formatter(buyPrice + updated.pts);

    showNote(name, isTarget ? "greater" : "less", updated.pts === 0);

    if (isRecursive) return updated;
    else if (name !== "calculator") {
      updateRiskCalculator(
        oppositeSection.name,
        handlePercentChange(
          oppositeSection,
          field,
          getPtsByRatio(isTarget, updatedPercent, riskReward.ratio),
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
  return handlePercentChange;
}
