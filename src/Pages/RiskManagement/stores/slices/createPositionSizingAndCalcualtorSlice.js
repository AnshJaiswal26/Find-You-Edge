import { createMetrics } from "@RM/utils";

export const createPositionSizingAndCalculatorSlice = () => ({
  positionSizing: {
    name: "positionSizing",
    adjustedSl: 0,
    suggestedQty: 0,
    lotSize: 0,
    slPts: 0,
    riskAmount: 0,
    riskPercent: 0,
    prevVal: 0,
  },

  calculator: {
    name: "calculator",
    ...createMetrics(),
    prevVal: 0,
  },
});
