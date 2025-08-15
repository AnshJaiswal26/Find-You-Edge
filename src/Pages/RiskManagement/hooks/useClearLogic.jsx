import { useRef } from "react";
import { useCalculatorStore, useTooltipStore } from "@RM/context";

export default function useClearLogic() {
  const clearTimers = useRef({});
  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);
  const showNote = useTooltipStore((s) => s.showNote);

  const clearSection = (secName) => {
    if (clearTimers.current[secName]) return;

    if (secName !== "calculator") {
      const field = secName === "target" ? "greater" : "less";

      updateSection("riskReward", {
        ratio: 0,
      });

      showNote(secName, field, false);
    }

    updateSection(secName, 0);
    updateSection("transaction", 0);

    clearTimers.current[secName] = setTimeout(() => {
      delete clearTimers.current[secName];
    }, 1000);
  };

  const clearTargetAndStopLoss = () => {
    clearSection("target");
    clearSection("stopLoss");
  };

  return { clearSection, clearTargetAndStopLoss };
}
