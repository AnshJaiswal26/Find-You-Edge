/* eslint-disable react-refresh/only-export-components */
import { fields } from "@RM/data";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

const NoteContext = createContext();

export default function NoteContextProvider({ children }) {
  const [note, setNote] = useState({
    riskReward: { ratio: false },
    capital: { current: false },
    calculator: {
      buyPriceNeg: false,
      sellPriceNeg: false,
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
    },
    target: {
      buyPriceNeg: false,
      sellPriceNeg: false,
      buyPriceLesser: false,
      sellPriceGreater: false,
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
    },
    stopLoss: {
      buyPriceNeg: false,
      sellPriceNeg: false,
      buyPriceGreater: false,
      sellPriceLesser: false,
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
    },
    pyramiding: {
      achieved: false,
    },
  });

  const getFilteredNotes = useCallback(
    (prev) =>
      fields.reduce((acc, k) => {
        if (prev[k]) acc[k] = false;
        return acc;
      }, {}),
    []
  );

  const showNote = useCallback((section, field, isVisible = true) => {
    setNote((prev) => {
      const current = prev[section][field];

      if ((current && isVisible) || (!current && !isVisible)) return prev;

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: isVisible,
        },
      };
    });
  }, []);

  const showNoteInBatch = useCallback(
    (section, updates) => {
      setNote((prev) => {
        const currentSection = prev[section];

        const filtered = {
          ...(currentSection.buyPriceNeg || currentSection.sellPriceNeg
            ? getFilteredNotes(currentSection)
            : {}),
          ...updates,
        };

        const diff = Object.entries(filtered).reduce((acc, [key, val]) => {
          if (currentSection[key] !== val) acc[key] = val;
          return acc;
        }, {});

        const merged = { ...currentSection, ...diff };

        if (Object.keys(diff).length === 0) return prev;

        return {
          ...prev,
          [section]: merged,
        };
      });
    },
    [getFilteredNotes]
  );

  const value = useMemo(
    () => ({ note, showNote, showNoteInBatch }),
    [note, showNote, showNoteInBatch]
  );

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export const useNote = () => useContext(NoteContext);
