/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const UIContext = createContext();

export function UIContextProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem("isSidebarOpen") === "true" || false
  );

  const [selectedAvatar, setSelectedAvatar] = useState("Icons/avtar/user.png");
  const [userName, setUserName] = useState("Ansh Jaiswal");

  document.documentElement.classList.toggle("dark-theme", theme === "dark");
  document.documentElement.classList.toggle("sidebar-open", isSidebarOpen);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("isSidebarOpen", isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    []
  );
  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isSidebarOpen,
      setIsSidebarOpen,
      selectedAvatar,
      setSelectedAvatar,
      userName,
      setUserName,
      toggleTheme,
      toggleSidebar,
    }),
    [
      theme,
      setTheme,
      isSidebarOpen,
      setIsSidebarOpen,
      selectedAvatar,
      setSelectedAvatar,
      userName,
      setUserName,
      toggleTheme,
      toggleSidebar,
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
