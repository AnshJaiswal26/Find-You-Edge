/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";
import { createFlash, createMetrics, updater } from "@RM/utils";

export const useCalculatorStore = create((set, get) => {
  return {
    currentTransaction: "calculator",
    currentTab: "normal",

    capital: {
      name: "capital",
      current: 0,
      prevVal: 0,
    },

    calculator: {
      name: "calculator",
      ...createMetrics(),
      color: "neutral",
      labels: ["Captured Points"],
      prevVal: 0,
    },

    positionSizing: {
      name: "positionSizing",
      riskAmount: 0,
      riskPercent: 0,
      qty: 0,
      color: "neutral",
      labels: ["Risk (%)", "Risk (₹)", "Qty"],
      prevVal: 0,
    },

    riskReward: {
      name: "riskReward",
      ratio: 0,
      prevRatio: 0,
      prevVal: 0,
    },

    target: {
      name: "target",
      ...createMetrics(),
      color: "green",
      labels: ["Target Points", "Target (₹)", "Target (%)"],
      prevVal: 0,
    },

    stopLoss: {
      name: "stopLoss",
      ...createMetrics(),
      color: "red",
      labels: ["SL Points", "SL (₹)", "SL (%)"],
      prevVal: 0,
    },

    flash: {
      capital: { current: false },
      calculator: createFlash(),
      riskReward: { ratio: false },
      target: createFlash(),
      stopLoss: createFlash(),
    },

    pyramiding: {
      name: "pyramiding",
      currentLayer: 0,
      riskIncrement: "Fix",
      at: "priceAchieved",
      table: {
        headers: [
          "Layer",
          "Entry Price",
          "Qty",
          "Risk/Reward",
          "Risk (%) Per Layer",
          "Cumulative Risk",
          "Risk (₹) Per Layer",
          "Avg Buy Price",
        ],
        rows: [
          {
            layer: 1,
            priceAchieved: 0,
            addQty: 0,
            rrAchieved: 0,
            riskPerLayer: 0,
            cummulativeRisk: 0,
            riskAmount: 0,
            avgBuyPrice: 0,
          },
        ],
      },
      prevVal: 0,
    },

    updateSection: (section, updates, cfg) =>
      updater(set, section, updates, cfg),
  };
});

export default useCalculatorStore;
