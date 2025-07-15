/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

export const CalculatorContext = createContext();

export function CalculatorContextProvider({ children }) {
  const [calculator, setcalculator] = useState({
    name: "calculator",
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "neutral",
    labels: ["Captured (Pts)", "Net P&L (₹)", "Net P&L (%)"],
    prevVal: 0,
  });
  const [positionSizing, setPositionSizing] = useState({
    name: "positionSizing",
    riskAmount: 0,
    riskPercent: 0,
    qty: 0,
    color: "neutral",
    labels: ["Risk (%)", "Risk (₹)", "Qty"],
    prevVal: 0,
  });

  const setterMap = useMemo(
    () => ({
      calculator: setcalculator,
      positionSizing: setPositionSizing,
    }),
    []
  );

  const updateCalculator = useCallback((section, updates) => {
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
  }, []);

  const value = useMemo(
    () => ({
      calculator,
      positionSizing,
      updateCalculator,
    }),
    [calculator, positionSizing, updateCalculator]
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => useContext(CalculatorContext);
