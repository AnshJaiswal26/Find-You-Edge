/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";

const SettingsContext = createContext();

export default function SettingsContextProvider({ children }) {
  const [settings, setSettings] = useState({
    show: false,
    autoRounding: false,
    calculation: { mode: "Approx" },
    derived: { mode: "sellPrice" },
    guide: { selectedField: "buyPrice" },
    amount: { changesIn: "sellPrice" },
    selectedSection: "Calculator",
  });

  const updateSettings = useCallback(
    (updates) =>
      setSettings((prev) => ({
        ...prev,
        ...updates,
      })),
    [setSettings]
  );
  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
