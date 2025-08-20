import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { usePtsAmountAndPercentHandler } from ".";
import { formatValue, logResult, logStart } from "@RM/utils";
import { shouldFormat } from "@RM/utils";

export default function useFormatterLogic() {
  const updateSection = useRiskManagementStore((s) => s.update.section);
  const handlePtsAmountAndPercentChange = usePtsAmountAndPercentHandler();

  const formatAndUpdate = useCallback(
    (sec, formatedKeys, mode) => {
      logStart("formatAndUpdate", { sec, formatedKeys, mode });
      const { name, buyPrice, sellPrice, qty } = sec;

      if (mode === "Approx") {
        updateSection(sec.name, formatedKeys);
        return;
      }

      const section = handlePtsAmountAndPercentChange({
        section: {
          name,
          buyPrice: formatValue(buyPrice, { mode: mode }),
          sellPrice: formatValue(sellPrice, { mode: mode }),
          qty,
        },
        field: "pts",
        val: formatValue(sec.pts, { mode: mode }),
        isFormatting: true,
      });

      updateSection(name, section);
      logResult("formatAndUpdate", `formating done for ${sec.name}`);
    },
    [handlePtsAmountAndPercentChange, updateSection]
  );

  const format = useCallback(() => {
    const sections = useRiskManagementStore.getState();
    const { settings, currentTab } = sections;
    const sectionArray =
      currentTab === "normal" ? ["calculator"] : ["target", "stopLoss"];
    const mode = settings.calculation.mode;

    sectionArray.forEach((k) => {
      const sec = sections[k];
      const formatedKeys = shouldFormat(sec, mode);
      if (formatedKeys) formatAndUpdate(sec, formatedKeys, mode);
    });
  }, [formatAndUpdate]);

  return { format };
}
