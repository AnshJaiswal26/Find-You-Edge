import { createFlash } from "@RM/utils";

export const createRiskManagementUiSlice = () => ({
  currentTab: "normal",
  currentTransaction: "calculator",
  hoveredInput: "",
  inputPrev: 0,

  capitalFlash: { current: false },
  riskrewardFlash: { ratio: false },
  calculatorFlash: {
    ...createFlash(),
  },
  targetFlash: {
    ...createFlash(),
  },
  stopLossFlash: {
    ...createFlash(),
  },

  capitalTooltip: { current: null },
  riskRewardTooltip: { ratio: null },
  calculatorTooltip: { buyPrice: null, sellPrice: null },
  targetTooltip: { buyPrice: null, sellPrice: null },
  stopLossTooltip: { buyPrice: null, sellPrice: null },
  anyTooltipActive: null,
});
