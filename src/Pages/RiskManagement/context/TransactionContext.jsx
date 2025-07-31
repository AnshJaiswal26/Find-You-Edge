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
      if (updates === 0) {
        const updatedToZero = {};
        setTransaction((prev) => {
          const keys = ["buyPrice", "sellPrice", "qty"];
          keys.forEach((key) => {
            updatedToZero[key] = 0;
          });
          return { ...prev, ...updatedToZero };
        });
        return;
      }
      setTransaction((prev) => {
        return { ...prev, ...updates };
      });
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
