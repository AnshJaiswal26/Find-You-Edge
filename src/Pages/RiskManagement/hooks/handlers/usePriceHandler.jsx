import { useRefiners } from "../useRefiners";
import { getUpdatedPts, getPtsByRatio } from "../../utils/utils";
import { useRiskCalculator, useNote } from "../../context/context";

export function usePriceHandler() {
  const { getFormatter } = useRefiners();
  const { showNote } = useNote();
  const { capital, riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();

  const handlePriceChange = (section, field, val, isRecursive = false) => {
    const { name, qty, amount } = section;

    const isTarget = name === "target";
    const oppositeSection = isTarget ? stopLoss : target;
    const formatter = getFormatter(name);

    const isBuyPrice = field === "buyPrice";
    const updatedPrice = Math.max(0, val);
    const updated = {
      [field]: formatter(updatedPrice),
      pts: formatter(getUpdatedPts(section, updatedPrice, isBuyPrice)),
    };

    if (isBuyPrice) {
      updated.sellPrice = formatter(amount / qty + updatedPrice);
      updated.pts = formatter(updated.sellPrice - updatedPrice);
    } else {
      updated.amount = formatter(updated.pts * qty);
      updated.percent = formatter((updated.amount / capital.current) * 100, 0);
    }

    showNote(name, isTarget ? "greater" : "less", updated.pts === 0);

    if (isRecursive) return updated;
    else if (name !== "calculator") {
      updateRiskCalculator(
        oppositeSection.name,
        handlePriceChange(
          oppositeSection,
          field,
          isBuyPrice
            ? updatedPrice
            : getPtsByRatio(isTarget, updated.pts, riskReward.ratio),
          true
        )
      );
    }

    return {
      section: updated,
      transaction: {
        [field]: formatter(updatedPrice),
        ...(updated.sellPrice !== undefined && {
          sellPrice: updated.sellPrice,
        }),
        qty: qty,
      },
    };
  };

  return handlePriceChange;
}
