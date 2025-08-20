import { logResult, logStart, safe } from ".";

export const is = {
  TOrSl: (f) => f === "target" || f === "stopLoss",
  oSL: (f) => (f === "target" ? "stopLoss" : "target"),
  oFU: (f) => (f === "buyPrice" ? "Sell Price" : "Buy Price"),
  oFL: (f) => (f === "buyPrice" ? "sellPrice" : "buyPrice"),
  PAP: (f) => f === "pts" || f === "amount" || f === "percent",
  BSQ: (f) => f === "buyPrice" || f === "sellPrice" || f === "qty",
  BS: (f) => f === "buyPrice" || f === "sellPrice",
};

export const resolvePts = (name, pts, newPts) => {
  logStart("getCalculatedPts");

  const ptsBySec = (() => {
    switch (name) {
      case "calculator":
        return newPts;
      case "target":
        return newPts < 0 ? pts : newPts;
      default:
        return newPts > 0 ? pts : newPts;
    }
  })();

  logResult("getDerivedObj", ptsBySec);
  return ptsBySec;
};

export const getPtsByRatio = (isTarget, val, ratio) => {
  logStart("getPtsByRatio", { isTarget, val, ratio });
  const amt = Math.abs(val);
  const newPts = isTarget ? -amt / ratio : amt * ratio;
  logResult("getPtsByRatio", newPts);
  return newPts;
};

export const getValBySecName = (s, v) =>
  s === "target" ? Math.abs(v) : s === "stopLoss" ? -Math.abs(v) : v;

export const resetAllToZero = (keys) => {
  logStart("resetAllToZero", { keys });

  const updatedToZero = keys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  logResult("resetAllToZero", updatedToZero);
  return updatedToZero;
};

export const getUpdatedKeys = (prev, updates, prevTooltip) => {
  logStart("getUpdatedKeys", { prev, updates });

  const toFlash = {};
  const toReset = {};

  const toUpdate = Object.keys(updates).reduce((acc, key) => {
    const newVal = updates[key];
    const tooltipKey = prevTooltip?.[key];

    if (newVal !== prev[key]) {
      acc[key] = newVal;
      if (!tooltipKey) {
        toFlash[key] = true;
        toReset[key] = false;
      }
    }
    return acc;
  }, {});

  logResult("getUpdatedKeys", toUpdate);
  return { toFlash, toUpdate, toReset };
};
