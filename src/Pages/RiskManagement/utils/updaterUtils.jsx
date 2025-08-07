import { fields } from "@RM/data";
import { cleanFloat, safe } from "./formatterUtils";
import { getStates, getUpdatedKeys } from "./stateUtils";

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
    console.groupCollapsed(`%c[updater] Updating with:`, "color: #d3ff63ff;");
    console.log("Section:", section);
    console.log("Updates:", updates);
    console.log("Config:", cfg);

    if (updates === 0) {
      const updatedToZero = {};
      fields.forEach((key) => {
        updatedToZero[key] = 0;
      });
      console.log(`Resetting ${section} values to zero:`, updatedToZero);

      setterMap[section]((prev) => {
        const result = getStates({ prev, updatedToZero });
        console.log(
          `%cUpdated ${section} state:`,
          "color: #22c55e; font-weight: bold",
          result
        );
        return result;
      });

      console.groupEnd();
      return;
    }

    const preciseUpdates = cfg.round
      ? fields.reduce(
          (acc, key) => {
            if (key in updates) {
              acc[key] =
                key === "percent"
                  ? safe(updates[key] ?? 0)
                  : cleanFloat(updates[key] ?? 0);
            }
            return acc;
          },
          { ...updates }
        )
      : updates;

    console.log("→ Precise Updates:", preciseUpdates);

    const flash = (keysToFlash, keysToReset) => {
      const flashName = section + "Flash";

      console.groupCollapsed(`%c[flash] ${flashName}`, "color: #d3ff63ff;");
      console.log("Keys to Flash:", keysToFlash);
      console.log("Keys to Reset:", keysToReset);

      setterMap[flashName]((prev) => {
        const next =
          Object.keys(keysToFlash).length === 0
            ? prev
            : { ...prev, ...keysToFlash };
        console.log(
          `%cflash set with ${flashName}:`,
          "color: #22c55e; font-weight: bold",
          next
        );
        return next;
      });

      setTimeout(() => {
        setterMap[flashName]((prev) => {
          const next =
            Object.keys(keysToReset).length === 0
              ? prev
              : { ...prev, ...keysToReset };
          console.log(
            `%cflash reset with ${flashName}:`,
            "color: #22c55e; font-weight: bold",
            next
          );
          return next;
        });
      }, cfg.duration);

      console.groupEnd();
    };

    setterMap[section]((prev) => {
      const { keysToUpdate, keysToFlash, keysToReset } = getUpdatedKeys({
        prev,
        updates: preciseUpdates,
      });

      if (Object.keys(keysToUpdate).length === 0) {
        console.log("→ No update needed, returning previous state");
        console.groupEnd();
        return prev;
      }

      if (cfg.flashing) {
        flash(keysToFlash, keysToReset);
      }

      const result = getStates({
        prev,
        updates: keysToUpdate,
      });

      console.log(
        `%cUpdated ${section} state:`,
        "color: #22c55e; font-weight: bold",
        result
      );
      console.groupEnd();
      return result;
    });
  };

  return updater;
};
