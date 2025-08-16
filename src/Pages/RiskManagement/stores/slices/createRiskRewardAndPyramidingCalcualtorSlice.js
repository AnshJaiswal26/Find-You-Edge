import { createMetrics } from "@RM/utils";

export const createRiskRewardAndPyramidingCalculatorSlice = () => ({
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
});
