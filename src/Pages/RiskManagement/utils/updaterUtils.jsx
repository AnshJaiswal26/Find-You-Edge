import { cleanFloat, safe } from "./formatterUtils";
import { getFlashers, getStates } from "./stateUtils";

export const set = (setterMap) => {
  const updater = (
    section,
    updates,
    cfg = {
      flashing: true,
      duration: 150,
      round: true,
    }
  ) => {
    const keys = ["buyPrice", "sellPrice", "qty", "pts", "amount", "percent"];

    const safeAll = () => {
      const safeObj = {};
      keys.forEach((key) => {
        if (key in updates)
          safeObj[key] =
            key === "percent"
              ? safe(updates[key] ?? 0)
              : cleanFloat(updates[key] ?? 0);
      });
      return { ...updates, ...safeObj };
    };

    const preciseUpdates = cfg.round ? safeAll() : updates;

    console.log(
      preciseUpdates,
      "preciseUpdates",
      "for section",
      section,
      "round:",
      cfg.round
    );

    if (updates === 0) {
      const updatedToZero = {};
      keys.forEach((key) => {
        updatedToZero[key] = 0;
      });
      setterMap[section]((prev) => {
        return getStates({ prev, updatedToZero });
      });
      return;
    }

    setterMap[section]((prev) => {
      const flashers = getFlashers({ prev, updates: preciseUpdates });
      return getStates({
        prev,
        updates: preciseUpdates,
        flashers: cfg.flashing ? flashers : {},
      });
    });

    if (cfg.flashing)
      setTimeout(() => {
        const resetFlash = getFlashers({
          updates: preciseUpdates,
          reset: true,
        });
        setterMap[section]((prev) => getStates({ prev, flashers: resetFlash }));
      }, cfg.duration);
  };

  return updater;
};
