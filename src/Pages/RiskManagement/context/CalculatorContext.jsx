/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useRefiners } from "@RM/hooks";
import { set } from "@RM/utils";

export const CalculatorContext = createContext();

export default function CalculatorContextProvider({ children }) {
  const { refine } = useRefiners();

  const [calculator, setcalculator] = useState({
    name: "calculator",
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "neutral",
    labels: ["Captured Points"],
    prevVal: 0,
    flash: {
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
    },
    mode: "approx",
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

  const updateCalculator = useMemo(
    () => set(setterMap, refine),
    [setterMap, refine]
  );

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
