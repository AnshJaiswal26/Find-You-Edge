import { useRiskManagementStore } from "@RM/stores";
import { formatValue, logResult, logStart } from ".";
import { fields } from "@RM/data";

export const is = {
  TOrSl: (f) => f === "target" || f === "stopLoss",
  oFU: (f) => (f === "buyPrice" ? "Sell Price" : "Buy Price"),
  oFL: (f) => (f === "buyPrice" ? "sellPrice" : "buyPrice"),
  PAP: (f) => f === "pts" || f === "amount" || f === "percent",
  BSQ: (f) => f === "buyPrice" || f === "sellPrice" || f === "qty",
  BS: (f) => f === "buyPrice" || f === "sellPrice",
};

export const getDerivedObj = (section, price, isBuyPrice, derivedField) => {
  logStart("getDerivedObj", { section, price, isBuyPrice, derivedField });

  const { name, buyPrice, sellPrice, pts } = section;

  const getCalculatedPts = () => {
    logStart("getCalculatedPts");
    const newPts = isBuyPrice ? sellPrice - price : price - buyPrice;

    let result;
    if (name === "calculator") {
      result = newPts;
    } else if (name === "target") {
      result = newPts < 0 ? pts : newPts;
    } else {
      result = newPts > 0 ? pts : newPts;
    }

    logResult("getCalculatedPts", result);
    return result;
  };

  const ptsBySec = getCalculatedPts();
  const isBuyLock = derivedField === "buyPrice";
  const isAmountLock = derivedField === "amount";
  const newPtsObj = { pts: ptsBySec };

  let result;

  if (isAmountLock) {
    result = newPtsObj;
  } else if (isBuyPrice) {
    result = isBuyLock ? newPtsObj : { sellPrice: pts + price };
  } else {
    result = isBuyLock ? { buyPrice: price - pts } : newPtsObj;
  }

  logResult("getDerivedObj", result);
  return result;
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
    const prevVal = String(prev[key]);
    const newVal = String(updates[key]);
    const tooltipKey = prevTooltip?.[key];

    if (newVal !== prevVal) {
      acc[key] = updates[key];
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

export const shouldFormat = (sec, mode) => {
  if (sec.pts === 0) return false;

  const format = (acc, key) => (acc[key] = formatValue(sec[key], { mode }));
  const regex1 = /^-?\d+(?:\.(?:\d{1}|(?:\d{1}[05])))?$/;
  const regex2 = /^-?\d+(?:\.\d{2})?$/;

  const formatedKeys = fields.reduce((acc, key) => {
    const val = sec[key].toString();

    if (mode !== "Approx" && !regex1.test(val)) acc[key] = sec[key];
    else if (mode === "Approx" && !regex2.test(val)) format(acc, key);
    return acc;
  }, {});

  return Object.keys(formatedKeys).length !== 0 ? formatedKeys : false;
};
