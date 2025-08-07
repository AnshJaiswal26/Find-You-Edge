import {
  useCalculator,
  useRiskCalculator,
  useSettings,
  useTab,
} from "@RM/context";
import { useAmountAndPtsHandler, useUpdater } from ".";
import { formatValue } from "@RM/utils";
import { useCallback } from "react";
import { fields } from "@RM/data";

export default function useFormatterLogic() {
  const { currentTab } = useTab();
  const { settings } = useSettings();
  const { target, stopLoss } = useRiskCalculator();
  const { calculator } = useCalculator();
  const { updateSection, updateTransaction } = useUpdater();
  const handleAmountOrPtsChange = useAmountAndPtsHandler();

  const mode = settings.calculation.mode;

  const shouldFormat = useCallback(
    (sec) => {
      if (sec.pts === 0) return false;

      const format = (acc, key) => (acc[key] = formatValue(sec[key], mode));

      const formatedKeys = fields.reduce((acc, key) => {
        const val = sec[key].toString();
        const regex1 = /^-?\d+(?:\.(?:\d{1}|(?:\d{1}[05])))?$/;
        const regex2 = /^-?\d+(?:\.\d{2})?$/;

        if (mode !== "Approx" && !regex1.test(val)) format(acc, key);
        else if (mode === "Approx" && !regex2.test(val)) format(acc, key);
        return acc;
      }, {});

      return Object.keys(formatedKeys).length !== 0 ? formatedKeys : false;
    },
    [mode]
  );

  const formatAndUpdate = useCallback(
    (sec, formatedKeys) => {
      if (mode === "Approx") {
        updateSection(sec.name, formatedKeys);
        return;
      }
      const correctMode = mode === "Buffer" ? "Market" : mode;

      const formated = {
        name: sec.name,
        buyPrice: formatValue(sec.buyPrice, correctMode),
        sellPrice: formatValue(sec.sellPrice, correctMode),
        qty: sec.qty,
      };
      const adjustedPts = formatValue(sec.pts, mode);

      const { section, transaction } = handleAmountOrPtsChange(
        formated,
        "pts",
        adjustedPts,
        false
      );

      updateSection(sec.name, { ...formated, ...section });
      if (sec.name !== "target") updateTransaction("transaction", transaction);
    },
    [mode, handleAmountOrPtsChange, updateSection, updateTransaction]
  );

  const format = useCallback(() => {
    const isNormal = currentTab === "normal";

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
  }, [currentTab, calculator, target, stopLoss, formatAndUpdate, shouldFormat]);

  return { format, mode };
}
