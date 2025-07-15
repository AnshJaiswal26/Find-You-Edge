import { useNote, useRiskCalculator } from "../../context/context";

export function useQtyHandler() {
  const { showNote } = useNote();
  const { capital, riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();

  const formatter = (val) => {
    if (!isFinite(val) || isNaN(val)) return 0;
    else return parseInt(val);
  };

  function handleQtyChange(section, field, val, isRecursive = false) {
    const { name, buyPrice, amount } = section;
    const isTarget = name === "target";
    const oppositeSection = isTarget ? stopLoss : target;

    const updatedQty = Math.max(0, val);
    const updated = { qty: updatedQty };
    updated.pts = formatter(amount / updatedQty);
    updated.sellPrice = formatter(buyPrice + updated.pts);
    updated.percent = formatter(amount / capital, 0);

    showNote(name, isTarget ? "greater" : "less", updated.pts === 0);

    if (isRecursive) return updated;
    else if (name !== "calculator") {
      updateRiskCalculator(
        oppositeSection.name,
        handleQtyChange(oppositeSection, field, updatedQty, true)
      );
    }

    return {
      section: updated,
      transaction: {
        buyPrice: buyPrice,
        sellPrice: updated.sellPrice,
        qty: updatedQty,
      },
    };
  }
  return handleQtyChange;
}
