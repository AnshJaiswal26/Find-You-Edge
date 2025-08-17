import { createFlash } from "@RM/utils";

export const createRiskManagementUiSlice = () => ({
  currentTab: "normal",
  currentTransaction: "calculator",
  hoveredInput: "",

  flash: {
    capital: { current: false },
    calculator: createFlash(),
    riskReward: { ratio: false },
    target: createFlash(),
    stopLoss: createFlash(),
  },

  tooltip: {
    capital: { current: null },
    riskReward: { ratio: null },
    calculator: {
      buyPrice: null,
      sellPrice: null,
    },
    target: {
      buyPrice: null,
      sellPrice: null,
    },
    stopLoss: {
      buyPrice: null,
      sellPrice: null,
    },
    anyActive: false,
  },
});
