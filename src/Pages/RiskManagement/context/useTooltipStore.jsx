/* eslint-disable react-refresh/only-export-components */
import { logResult, logStart, logStateUpdate } from "@RM/utils";
import { create } from "zustand";

const showTooltip = (section, updates, set) => {
  set((prev) => {
    const timer = logStart("showTooltip", { section, updates });
    const prevSec = prev[section];

    if (section === "capital" || section === "riskReward") {
      logStateUpdate(`Tooltip set for ${section}`, updates);
      timer.end();
      return { [section]: updates };
    }

    const diff = Object.entries(updates).reduce((acc, [key, val]) => {
      const prevField = prevSec[key];
      if (prevField === null && val !== null) acc[key] = val;
      if (prevField && val) prevField.key !== val.key && (acc[key] = val);
      if (prevField !== null && val === null) acc[key] = val;
      return acc;
    }, {});

    if (Object.keys(diff).length === 0) {
      logResult("setTooltipkey", "No Update Required.");
      return prev;
    }

    logStateUpdate(`Tooltip set for ${section}`, diff);
    timer.end();
    return { [section]: { ...prevSec, ...diff } };
  });
};

export const useTooltipStore = create((set) => {
  return {
    capital: { current: null },
    riskReward: { ratio: null },
    calculator: {
      buyPrice: null,
      sellPrice: null,
      qty: null,
      pts: null,
      amount: null,
      percent: null,
    },
    target: {
      buyPrice: null,
      sellPrice: null,
      qty: null,
      pts: null,
      amount: null,
      percent: null,
    },
    stopLoss: {
      buyPrice: null,
      sellPrice: null,
      qty: null,
      pts: null,
      amount: null,
      percent: null,
    },
    anyActive: false,

    showNote: (section, updates) => showTooltip(section, updates, set),
  };
});

export default useTooltipStore;
