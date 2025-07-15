/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

export const RiskCalculatorContext = createContext();

export function RiskCalculatorContextProvider({ children }) {
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
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "green",
    labels: ["Target (Pts)", "Target (₹)", "Target (%)"],
    prevVal: 0,
  });

  const [stopLoss, setStopLoss] = useState({
    name: "stopLoss",
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "red",
    labels: ["SL (Pts)", "SL (₹)", "SL (%)"],
    prevVal: 0,
  });

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
    }),
    []
  );

  const updateRiskCalculator = useCallback(
    (section, updates) => {
      if (updates === 0) {
        const updatedToZero = {};
        setterMap[section]((prev) => {
          const keys = [
            "buyPrice",
            "sellPrice",
            "qty",
            "pts",
            "amount",
            "percent",
          ];
          keys.forEach((key) => {
            updatedToZero[key] = 0;
          });
          return { ...prev, ...updatedToZero };
        });
        return;
      }
      setterMap[section]((prev) => {
        return { ...prev, ...updates };
      });
    },
    [setterMap]
  );

  const value = useMemo(
    () => ({
      capital,
      riskReward,
      target,
      stopLoss,
      pyramiding,
      updateRiskCalculator,
    }),
    [capital, riskReward, target, stopLoss, pyramiding, updateRiskCalculator]
  );

  return (
    <RiskCalculatorContext.Provider value={value}>
      {children}
    </RiskCalculatorContext.Provider>
  );
}

export const useRiskCalculator = () => useContext(RiskCalculatorContext);
