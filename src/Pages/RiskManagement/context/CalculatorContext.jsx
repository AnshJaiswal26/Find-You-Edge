/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createFlash, createMetrics, set } from "@RM/utils";

export const CalculatorContext = createContext();

export default function CalculatorContextProvider({ children }) {
  const [calculator, setCalculator] = useState({
    name: "calculator",
    ...createMetrics(),
    color: "neutral",
    labels: ["Captured Points"],
    prevVal: 0,
    mode: "approx",
  });

  
  const [calculatorFlash, setCalculatorFlash] = useState(createFlash());

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
      calculator: setCalculator,
      positionSizing: setPositionSizing,
      calculatorFlash: setCalculatorFlash,
    }),
    []
  );

  const updateCalculator = useMemo(() => set(setterMap), [setterMap]);

  const value = useMemo(
    () => ({
      calculator,
      positionSizing,
      calculatorFlash,
      updateCalculator,
    }),
    [calculator, positionSizing, calculatorFlash, updateCalculator]
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => useContext(CalculatorContext);
