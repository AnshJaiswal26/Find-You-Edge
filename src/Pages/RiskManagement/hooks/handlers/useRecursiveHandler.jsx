import { useNote } from "../../context/NoteContext";
import { useRiskCalculator } from "../../context/RiskCalculatorContext";

function useRecursiveHandler() {
  const { showNote } = useNote();
  const { riskReward, target, stopLoss, updateRiskCalculator } =
    useRiskCalculator();

  function updateOppositeSection(
    name,
    price,
    buyPrice,
    show,
    field,
    handler,
    isRecursive
  ) {
    const handleSectionUpdates = (secName, condition, oppositeSection) => {
      showNote(secName, condition, show);

      if (!isRecursive) {
        const getNewPtsAccordingToRR = () => {
          const pts = Math.abs(price);
          const newPts =
            secName === "target"
              ? -pts / riskReward.ratio
              : pts * riskReward.ratio;
          return newPts;
        };
        const isCommonFields = field === "qty" || field === "buyPrice";
        const newVal = isCommonFields ? price : getNewPtsAccordingToRR();
        updateRiskCalculator(
          oppositeSection.name,
          handler(oppositeSection, field, buyPrice + newVal, true)
        );
      }
    };

    if (name === "target") handleSectionUpdates(name, "greater", stopLoss);
    if (name === "stopLoss") handleSectionUpdates(name, "less", target);
  }
}
