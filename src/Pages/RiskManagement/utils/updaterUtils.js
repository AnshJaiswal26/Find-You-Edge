import { useRiskManagementStore } from "@RM/stores";
import { fields, postitionSizingFields } from "@RM/data";
import {
  getUpdatedKeys,
  logObj,
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

export const calculatorUpdater = (set, section, updates, inputCfg) => {
  const cfg = { ...defaultCfg, ...inputCfg };
  const timer = logStart("updateSection", { section, updates, cfg });

  set((prev) => {
    const prevSection = prev[section];

    if (section === "currentTransaction") {
      logStateUpdate(`Transaction set`, updates, timer);
      return { currentTransaction: updates };
    }

    if (updates === 0) {
      const zeros = resetAllToZero(fields);
      const result = { ...prevSection, ...zeros };
      logStateUpdate(`Inputs Reset to 0 for ${section}`, zeros, timer);
      return { [section]: result };
    }

    const roundedKeys = cfg.round ? roundKeys(updates) : updates;

    const prevTooltip = useRiskManagementStore.getState().tooltip[section];

    const { toUpdate, toFlash, toReset } = getUpdatedKeys(
      prevSection,
      roundedKeys,
      prevTooltip
    );

    logObj("toFlash", toFlash);

    if (Object.keys(toUpdate).length === 0) {
      logResult("updateSection", `No update needed for ${section}`);
      return prev;
    }

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

export const toolTipUpdater = (section, updates, prev) => {
  const timer = logStart("showTooltip", { section, updates });

  if (section === "capital" || section === "riskReward") {
    logStateUpdate(`Tooltip set for ${section}`, updates, timer);
    return { [section]: updates };
  }

  const diff = Object.entries(updates).reduce((acc, [f, val]) => {
    const prevField = prev[f];
    if (prevField === null && val !== null) acc[f] = val;
    if (prevField && val && prevField.key !== val.key) acc[f] = val;
    if (prevField !== null && val === null) acc[f] = val;
    return acc;
  }, {});

  if (Object.keys(diff).length === 0) {
    logResult("setTooltipkey", "No Update Required.");
    return prev;
  }

  logStateUpdate(`Tooltip set for ${section}`, diff, timer);
  return { [section]: { ...prev, ...diff } };
};
