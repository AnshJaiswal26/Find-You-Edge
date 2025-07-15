import { useRef } from "react";
import { useNote, useTransaction, useRiskCalculator } from "../context/context";

export function useClearLogic() {
  const clearTimers = useRef({});

  const { timeOut } = useNote();
  const { updateTransaction } = useTransaction();
  const { target, stopLoss, updateRiskCalculator } = useRiskCalculator();

  const clearSection = (section, update) => {
    if (clearTimers.current[section.name]) return;

    if (section.name !== "calculator") {
      const field = section.name === "target" ? "greater" : "less";

      updateRiskCalculator("riskReward", {
        ratio: 0,
      });

      timeOut(section.name, field, 0, false);
    }

    update(section.name, 0);
    updateTransaction(0);

    clearTimers.current[section.name] = setTimeout(() => {
      delete clearTimers.current[section.name];
    }, 1000);
  };

  const clearTargetAndStopLoss = () => {
    clearSection(target, updateRiskCalculator);
    clearSection(stopLoss, updateRiskCalculator);
  };

  return { clearSection, clearTargetAndStopLoss };
}
