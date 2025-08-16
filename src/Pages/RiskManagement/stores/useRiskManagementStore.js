/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";
import {
  createRiskManagementUiSlice,
  createPositionSizingAndCalculatorSlice,
  createRiskManagementSettingsSlice,
  createRiskRewardAndPyramidingCalculatorSlice,
  createUpdaterSlice,
} from "./slices";

export const useRiskManagementStore = create((set) => {
  return {
    capital: {
      name: "capital",
      current: 0,
      prevVal: 0,
    },

    ...createRiskManagementUiSlice(),
    ...createRiskManagementSettingsSlice(),
    ...createPositionSizingAndCalculatorSlice(),
    ...createRiskRewardAndPyramidingCalculatorSlice(),

    ...createUpdaterSlice(set),
  };
});

export default useRiskManagementStore;
