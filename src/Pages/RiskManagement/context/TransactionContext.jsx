/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

export const TransactionContext = createContext();

export default function TransactionContextProvider({ children }) {
  const [transaction, setTransaction] = useState({
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    currentSection: {
      name: "Calculator",
      color: "",
    },
  });

  const updateTransaction = useCallback(
    (updates) => {
      console.groupCollapsed(
        "%c[updateTransaction] Updating with:",
        "color: #d3ff63ff;"
      );
      console.log("updates: ", updates);

      if (updates === 0) {
        const updatedToZero = {};
        const keys = ["buyPrice", "sellPrice", "qty"];

        keys.forEach((key) => {
          updatedToZero[key] = 0;
        });

        console.log("Resetting transaction values to zero:", updatedToZero);

        setTransaction((prev) => {
          const merged = { ...prev, ...updatedToZero };
          console.log(
            "%cUpdated transaction state:",
            "color: #22c55e; font-weight: bold",
            merged
          );
          return merged;
        });

        // console.groupEnd();
        return;
      }

      setTransaction((prev) => {
        const merged = { ...prev, ...updates };
        console.log(
          "%cUpdated transaction state:",
          "color: #22c55e; font-weight: bold",
          merged
        );
        return merged;
      });

      console.groupEnd();
    },
    [setTransaction]
  );

  const value = useMemo(
    () => ({ transaction, updateTransaction }),
    [transaction, updateTransaction]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => useContext(TransactionContext);
