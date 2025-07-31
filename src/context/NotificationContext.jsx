/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  createContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

export const NotificationContext = createContext();

export default function NotificationContextProvider({ children }) {
  const [msg, setMessage] = useState({
    charges: {
      added: { isVisible: false, id: 0 },
      removed: { isVisible: false, id: 0 },
    },
  });

  const showMsg = useCallback((section, field, isVisible) => {
    const newId = Date.now(); // Unique ID for animation remount
    setMessage((prev) => {
      const current = prev[section][field].isVisible;

      if ((current && isVisible) || (!current && !isVisible)) return prev;

      const updatedSection = { ...prev[section] };

      if (section === "charges" && isVisible) {
        const otherField = field === "added" ? "removed" : "added";
        updatedSection[otherField] = {
          ...updatedSection[otherField],
          isVisible: false,
        };
      }

      updatedSection[field] = { isVisible, id: newId };

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  }, []);

  const value = useMemo(() => ({ msg, showMsg }), [msg, showMsg]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
