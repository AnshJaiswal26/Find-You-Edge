/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const TabContext = createContext();

export function TabContextProvider({ children }) {
  const [currentTab, setCurrentTab] = useState("normal");

  const value = useMemo(
    () => ({ currentTab, setCurrentTab }),
    [currentTab, setCurrentTab]
  );
  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}

export const useTab = () => useContext(TabContext);
