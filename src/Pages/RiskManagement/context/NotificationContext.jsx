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

export function NotificationContextProvider({ children }) {
  const [msg, setMessage] = useState({
    charges: {
      added: false,
      removed: false,
    },
  });

  const showMsgRefs = useRef({});

  const showMsg = useCallback((section, field, duration = 600) => {
    const key = `${section}_${field}`;
    if (showMsgRefs.current[key]) return;

    const show = (prop) =>
      setMessage((prev) => ({
        ...prev,
        [section]: {
          ...msg[section],
          [field]: prop,
        },
      }));

    show(true);
    showMsgRefs.current[key] = setTimeout(() => {
      show(false);
      delete showMsgRefs.current[key];
    }, duration);
  }, []);

  const value = useMemo(() => ({ msg, showMsg }), [msg, showMsg]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
