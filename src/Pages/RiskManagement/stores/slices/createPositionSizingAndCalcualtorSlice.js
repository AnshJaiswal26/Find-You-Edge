import { createMetrics } from "@RM/utils";

export const createPositionSizingAndCalculatorSlice = () => ({
  positionSizing: {
    name: "positionSizing",
    riskAmount: 0,
    riskPercent: 0,
    qty: 0,
    color: "neutral",
    labels: ["Risk (%)", "Risk (₹)", "Qty"],
    prevVal: 0,
  },

  calculator: {
    name: "calculator",
    ...createMetrics(),
    color: "neutral",
    labels: ["Captured Points"],
    prevVal: 0,
  },
});
