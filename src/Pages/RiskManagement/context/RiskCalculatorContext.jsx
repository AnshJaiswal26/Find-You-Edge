/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from "react";
import { createFlash, createMetrics, set } from "@RM/utils";

export const RiskCalculatorContext = createContext();

export default function RiskCalculatorContextProvider({ children }) {
  const [capital, setCapital] = useState({
    name: "capital",
    current: 0,
    prevVal: 0,
  });

  const [riskReward, setRiskReward] = useState({
    name: "riskReward",
    ratio: 0,
    prevRatio: 0,
    prevVal: 0,
  });

  const [target, setTarget] = useState({
    name: "target",
    ...createMetrics(),
    color: "green",
    labels: ["Target Points", "Target (₹)", "Target (%)"],
    prevVal: 0,
  });

  const [stopLoss, setStopLoss] = useState({
    name: "stopLoss",
    ...createMetrics(),
    color: "red",
    labels: ["SL Points", "SL (₹)", "SL (%)"],
    prevVal: 0,
  });

  const [targetFlash, setTargetFlash] = useState(createFlash());
  const [stopLossFlash, setStopLossFlash] = useState(createFlash());

  const [pyramiding, setPyramiding] = useState({
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
  });
  const setterMap = useMemo(
    () => ({
      capital: setCapital,
      riskReward: setRiskReward,
      target: setTarget,
      stopLoss: setStopLoss,
      pyramiding: setPyramiding,
      targetFlash: setTargetFlash,
      stopLossFlash: setStopLoss,
    }),
    []
  );

  const updateRiskCalculator = useMemo(() => set(setterMap), [setterMap]);

  const value = useMemo(
    () => ({
      capital,
      riskReward,
      target,
      stopLoss,
      pyramiding,
      targetFlash,
      stopLossFlash,
      updateRiskCalculator,
    }),
    [
      capital,
      riskReward,
      target,
      stopLoss,
      pyramiding,
      targetFlash,
      stopLossFlash,
      updateRiskCalculator,
    ]
  );

  return (
    <RiskCalculatorContext.Provider value={value}>
      {children}
    </RiskCalculatorContext.Provider>
  );
}

export const useRiskCalculator = () => useContext(RiskCalculatorContext);
