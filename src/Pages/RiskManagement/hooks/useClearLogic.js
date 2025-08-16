import { useRef } from "react";
import { useRiskManagementStore } from "@RM/stores";

export default function useClearLogic() {
  const clearTimers = useRef({});
  const updateSection = useRiskManagementStore((s) => s.update.section);
  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);

  const clearSection = (secName) => {
    if (clearTimers.current[secName]) return;

    if (secName !== "calculator") {
      const field = secName === "target" ? "greater" : "less";

      updateSection("riskReward", {
        ratio: 0,
      });

      // showTooltip(secName, field, false);
    }

    updateSection(secName, 0);

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
