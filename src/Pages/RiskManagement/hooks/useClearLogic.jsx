import { useRef } from "react";
import { useNote, useRiskCalculator } from "@RM/context";
import { useUpdater } from "@RM/hooks";

export default function useClearLogic() {
  const clearTimers = useRef({});

  const { timeOut } = useNote();
  const { target, stopLoss } = useRiskCalculator();
  const { updateSection, updateTransaction } = useUpdater();

  const clearSection = (section) => {
    const { name } = section;
    if (clearTimers.current[name]) return;

    if (name !== "calculator") {
      const field = name === "target" ? "greater" : "less";

      updateSection("riskReward", {
        ratio: 0,
      });

      timeOut(name, field, 0, false);
    }

    updateSection(name, 0);
    updateTransaction(0);

    clearTimers.current[name] = setTimeout(() => {
      delete clearTimers.current[name];
    }, 1000);
  };

  const clearTargetAndStopLoss = () => {
    clearSection(target);
    clearSection(stopLoss);
  };

  return { clearSection, clearTargetAndStopLoss };
}
