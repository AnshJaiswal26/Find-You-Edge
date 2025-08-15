import { useTooltipStore } from "@RM/context";
import { fields } from "@RM/data";
import {
  getUpdatedKeys,
  logResult,
  logStart,
  logStateUpdate,
  resetAllToZero,
  roundKeys,
} from "@RM/utils";

const flashTimeoutMap = new Map();
const defaultCfg = { flashing: true, duration: 100, round: true };

const triggerFlash = (section, set, prev, toFlash, toReset) => {
  logStart("triggerFlash", { section, toFlash, toReset });

  const key = `${section}_Flash`;
  const existingTimeout = flashTimeoutMap.get(key);
  if (existingTimeout) {
    logResult("triggerFlash", `Flash skipped for ${section} (already active)`);
    return;
  }

  const timeout = setTimeout(() => {
    set((prev) => {
      const prevFlashSection = prev.flash[section];
      const reset = { ...prevFlashSection, ...toReset };
      logStateUpdate(`Flash reset for ${section}`, toReset, false, false);
      return { flash: { ...prev.flash, [section]: reset } };
    });

    flashTimeoutMap.delete(key);
  }, defaultCfg.duration);

  flashTimeoutMap.set(key, timeout);

  const prevFlashSection = prev[section];
  const flashSec = { ...prevFlashSection, ...toFlash };
  logResult("triggerFlash", toFlash);
  return { ...prev, [section]: flashSec };
};

export const updater = (set, section, updates, inputCfg = defaultCfg) => {
  const cfg = { ...defaultCfg, ...inputCfg };
  const timer = logStart("updateSection", { section, updates, cfg });

  set((prev) => {
    if (section === "currentTransaction") {
      logStateUpdate(`Transaction set`, updates, timer);
      return { currentTransaction: updates };
    }

    if (updates === 0) {
      const prevSec = prev[section];
      const zeros = resetAllToZero(fields);
      const result = { ...prevSec, ...zeros };
      logStateUpdate(`Inputs Reset to 0 for ${section}`, zeros, timer);
      return { [section]: result };
    }

    const preciseUpdates = cfg.round ? roundKeys(fields, updates) : updates;

    const prevTooltip = useTooltipStore.getState()[section];
    const { toUpdate, toFlash, toReset } = getUpdatedKeys(
      prev[section],
      preciseUpdates,
      prevTooltip
    );

    if (Object.keys(toUpdate).length === 0) {
      logResult("updateSection", `No update needed for ${section}`);
      return prev;
    }

    const prevSection = prev[section];
    const result = { ...prevSection, ...toUpdate };

    const shouldFlash = cfg.flashing && Object.keys(toFlash).length > 0;

    const flashResult = shouldFlash
      ? triggerFlash(section, set, prev.flash, toFlash, toReset)
      : false;

    logStateUpdate(
      `Keys ${flashResult ? "& Flash" : ""} updated for ${section}`,
      { toUpdate, ...(flashResult && { toFlash: toFlash }) },
      timer
    );
    return { [section]: result, ...(flashResult && { flash: flashResult }) };
  });
};
