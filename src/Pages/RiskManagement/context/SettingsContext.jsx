/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";

const SettingsContext = createContext();

export function SettingsContextProvider({ children }) {
  const [showSettings, setShowSettings] = useState(false);
  const [calcMode, setCalcMode] = useState("approx");
  const [calcModeSAndT, setCalcModeSAndT] = useState("market");

  const setterMap = useMemo(
    () => ({
      showSettings: setShowSettings,
      calcMode: setCalcMode,
      calcModeSAndT: setCalcModeSAndT,
    }),
    []
  );

  const updateSettings = useCallback(
    (section, updates) => setterMap[section](updates),
    [setterMap]
  );
  const value = useMemo(
    () => ({ showSettings, calcMode, calcModeSAndT, updateSettings }),
    [showSettings, calcMode, calcModeSAndT, updateSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
