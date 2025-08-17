import { useCallback, useMemo } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useAmountAndPtsHandler } from ".";
import { formatValue, logEnd, logResult, logStart } from "@RM/utils";
import { shouldFormat } from "@RM/utils/derivedUtils";

const getArray = (t) =>
  t === "normal" ? ["calculator"] : ["target", "stopLoss"];

export default function useFormatterLogic() {
  const updateSection = useRiskManagementStore((s) => s.update.section);
  const handleAmountOrPtsChange = useAmountAndPtsHandler();

  const formatAndUpdate = useCallback(
    (sec, formatedKeys, mode) => {
      logStart("formatAndUpdate", { sec, formatedKeys, mode });
      const { name, buyPrice, sellPrice, qty } = sec;

      if (mode === "Approx") {
        updateSection(sec.name, formatedKeys);
        return;
      }

      const correctMode = mode === "Buffer" ? "Market" : mode;

      const formated = {
        buyPrice: formatValue(buyPrice, { mode: correctMode }),
        sellPrice: formatValue(sellPrice, { mode: correctMode }),
        qty: qty,
      };
      const adjustedPts = formatValue(sec.pts, { mode: mode });

      const section = handleAmountOrPtsChange({
        section: { name, ...formated },
        field: "pts",
        val: adjustedPts,
        sync: false,
      });

      updateSection(name, { ...section, ...formated });
      logResult("formatAndUpdate", { ...section, ...formated });
    },
    [handleAmountOrPtsChange, updateSection]
  );

  const format = useCallback(() => {
    const sections = useRiskManagementStore.getState();
    const sectionArray = getArray(sections.currentTab);
    const mode = sections.settings.calculation.mode;

    sectionArray.forEach((k) => {
      const sec = sections[k];
      const formatedKeys = shouldFormat(sec, mode);
      if (formatedKeys) formatAndUpdate(sec, formatedKeys, mode);
    });
  }, [formatAndUpdate]);

  return { format };
}
