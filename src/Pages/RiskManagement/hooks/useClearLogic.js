import { useRef } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { is, resetAllToZero } from "@RM/utils";
import { fields } from "@RM/data";

const resetAllTooltips = (tooltips) => {
  return Object.entries(tooltips).reduce((acc, [key, val]) => {
    if (val !== null) acc[key] = null;
    return acc;
  }, {});
};

export default function useClearLogic() {
  const clearTimers = useRef({});
  const updateSectionInBatch = useRiskManagementStore((s) => s.update.sections);

  const clearSection = (secName) => {
    if (clearTimers.current[secName]) return;
    const isTargetOrSL = is.TOrSl(secName);
    const oppositeSec = is.oSL(secName);

    const tooltipKey = secName + "Tooltip";
    const oppoTooltipkey = oppositeSec + "Tooltip";

    const state = useRiskManagementStore.getState();
    const sectionTooltips = state[tooltipKey];
    const isAnyActive = state.anyTooltipActive;

    const keysReset = resetAllToZero(fields[secName]);

    const updates = {};
    if (isTargetOrSL) {
      updates["riskReward"] = { ratio: 0 };
      updates[oppositeSec] = keysReset;
      isAnyActive &&
        (updates[oppoTooltipkey] = resetAllTooltips(state[oppoTooltipkey]));
    }

    updates[secName] = keysReset;
    isAnyActive && (updates[tooltipKey] = resetAllTooltips(sectionTooltips));

    updateSectionInBatch(updates);

    clearTimers.current[secName] = setTimeout(() => {
      delete clearTimers.current[secName];
    }, 1000);
  };

  return clearSection;
}
