import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { useAmountAndPtsHandler } from ".";
import { formatValue } from "@RM/utils";
import { shouldFormat } from "@RM/utils/derivedUtils";

export default function useFormatterLogic() {
  const currentTab = useRiskManagementStore((s) => s.currentTab);
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const handleAmountOrPtsChange = useAmountAndPtsHandler();

  const formatAndUpdate = useCallback(
    (sec, formatedKeys) => {
      const { name, buyPrice, sellPrice, qty } = sec;
      const mode = useRiskManagementStore.getState().settings.calculation.mode;

      if (mode === "Approx") {
        updateSection(sec.name, formatedKeys);
        return;
      }
      const correctMode = mode === "Buffer" ? "Market" : mode;

      const formated = {
        name: name,
        buyPrice: formatValue(buyPrice, correctMode),
        sellPrice: formatValue(sellPrice, correctMode),
        qty: qty,
      };
      const adjustedPts = formatValue(sec.pts, mode);

      const section = handleAmountOrPtsChange(
        formated,
        "pts",
        adjustedPts,
        false
      );

      updateSection(name, { ...formated, ...section });
    },
    [handleAmountOrPtsChange, updateSection]
  );

  const format = useCallback(() => {
    const isNormal = currentTab === "normal";
    const { calculator, target, stopLoss } = useRiskManagementStore.getState();

    if (isNormal) {
      const formatedKeys = shouldFormat(calculator);
      if (formatedKeys) formatAndUpdate(calculator, formatedKeys);
      console.log("formatAndUpdate", formatedKeys);
    } else {
      const formatedKeys1 = shouldFormat(stopLoss);
      const formatedKeys2 = shouldFormat(target);

      if (formatedKeys1) formatAndUpdate(stopLoss, formatedKeys1);
      if (formatedKeys2) formatAndUpdate(target, formatedKeys2);
    }
  }, [currentTab, formatAndUpdate]);

  return { format };
}
