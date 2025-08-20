import {
  getUpdatedKeys,
  logMsg,
  logObj,
  logResult,
  logStart,
  logStateUpdate,
  roundKeys,
} from "@RM/utils";

const flashTimeoutMap = new Map();

export const handleFlash = (sec, set, prev, toReset, toFlash, duration) => {
  const key = `${sec}Flash`;
  const existingTimeout = flashTimeoutMap.get(key);
  if (existingTimeout) {
    logMsg(`(triggerFlash): Flash skipped for ${sec} (already active)`);
    return;
  }
  // Reset
  const timeout = setTimeout(() => {
    logStateUpdate(`Flash reset for ${key}`, toReset);
    set((prev) => ({ [key]: { ...prev[key], ...toReset } }));
    flashTimeoutMap.delete(key);
  }, duration);
  flashTimeoutMap.set(key, timeout);

  return { [key]: { ...prev[key], ...toFlash } };
};

export const calculatorUpdater = (set, prev, sec, updates, cfg) => {
  const { round, flashing, duration } = cfg;
  logStart("calculatorUpdater");

  const prevSection = prev[sec];
  logObj("prevSection", sec);
  const prevTooltip = prev[sec + "Tooltip"];

  const roundedKeys = round ? roundKeys(updates) : updates;
  const { toUpdate, toFlash, toReset } = getUpdatedKeys(
    prevSection,
    roundedKeys,
    prevTooltip
  );

  if (Object.keys(toUpdate).length === 0) {
    logResult("calculatorUpdater", `No update needed for ${sec}`);
    return prev;
  }

  const shouldFlash = flashing && Object.keys(toFlash).length > 0;
  logStateUpdate(`Keys ${shouldFlash ? "& Flash " : ""}updated for ${sec}`, {
    toUpdate,
    ...(shouldFlash && { toFlash: toFlash }),
  });

  const result = { ...prevSection, ...toUpdate };
  logResult("calculatorUpdater", toUpdate);
  return {
    [sec]: result,
    ...(shouldFlash && handleFlash(sec, set, prev, toReset, toFlash, duration)),
  };
};

// Tooltip updates
export const toolTipUpdater = (section, updates, prev) => {
  if (section === "capitalTooltip" || section === "riskRewardTooltip") {
    logStateUpdate(`Tooltip set for ${section}`, updates);
    return { [section]: updates };
  }

  const diff = Object.entries(updates).reduce((acc, [f, val]) => {
    const prevField = prev[f];
    const changed =
      (prevField === null && val !== null) ||
      (prevField && val && prevField.key !== val.key) ||
      (prevField !== null && val === null);

    if (changed) acc[f] = val;
    return acc;
  }, {});

  if (Object.keys(diff).length === 0) {
    logResult("toolTipUpdater", "No Update Required.");
    return prev;
  }
  const hasActive = Object.values(diff).some((v) => v !== null);

  logStateUpdate(`Tooltip set for ${section}`, diff);
  return { [section]: { ...prev, ...diff }, anyTooltipActive: hasActive };
};
