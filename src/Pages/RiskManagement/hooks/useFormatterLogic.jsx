import { useCallback } from "react";
import { useCalculatorStore, useSettingsStore, useTab } from "@RM/context";
import { useAmountAndPtsHandler } from ".";
import { formatValue } from "@RM/utils";
import { shouldFormat } from "@RM/utils/derivedUtils";

export default function useFormatterLogic() {
  const { currentTab } = useTab();
  const updateSection = useCalculatorStore((s) => s.updateSection);

  const handleAmountOrPtsChange = useAmountAndPtsHandler();

  const formatAndUpdate = useCallback(
    (sec, formatedKeys) => {
      const { name, buyPrice, sellPrice, qty } = sec;
      const mode = useSettingsStore.getState().calculation.mode;

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
    const state = useCalculatorStore.getState();
    const calculator = state.calculator;
    const target = state.target;
    const stopLoss = state.stopLoss;

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
