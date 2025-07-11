import { createContext, useEffect, useState } from "react";

export const UIContext = createContext();

export function UIContextProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem("isSidebarOpen") === "true" || false
  );

  const [selectedAvatar, setSelectedAvatar] = useState("Icons/avtar/user.png");
  const [userName, setUserName] = useState("Ansh Jaiswal");

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("sidebar-open", isSidebarOpen);
    localStorage.setItem("isSidebarOpen", isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <UIContext.Provider
      value={{
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
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
