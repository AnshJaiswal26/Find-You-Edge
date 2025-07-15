/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

const NoteContext = createContext();

export function NoteContextProvider({ children }) {
  const timeOutRefs = useRef({});
  const showNoteRef = useRef({});

  const [note, setNote] = useState({
    riskReward: { ratio: false },
    capital: { current: false },
    target: {
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
      greater: false,
    },
    stopLoss: {
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
      less: false,
    },
    pyramiding: {
      achieved: false,
    },
  });
  const timeOut = useCallback((section, field, duration = 3000) => {
    const key = `${section}_${field}`;
    console.log("timeOut Triggered... for " + key);

    if (timeOutRefs.current[key]) {
      console.log(`timeOut (Already Processing.. for ${key}`);
      return;
    }

    const show = (prop) => {
      setNote((prev) => ({
        ...prev,
        [section]: {
          ...note[section],
          [field]: prop,
        },
      }));
    };

    show(true);
    timeOutRefs.current[key] = setTimeout(() => {
      show(false);
      delete timeOutRefs.current[key];
    }, duration);
  }, []);

  const showNote = useCallback((section, field, isVisible = false) => {
    const key = `${section}_${field}`;
    console.log("showNote Triggered... for " + key);

    setNote((prev) => {
      showNoteRef.current[key] = isVisible;
      return {
        ...prev,
        [section]: {
          ...note[section],
          [field]: isVisible,
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({ note, timeOut, showNote }),
    [note, timeOut, showNote]
  );

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export const useNote = () => useContext(NoteContext);
