import { fields } from "@RM/data";
import { logEnd, logObj, logResult, logStart } from ".";

export function formatINR(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return "₹0";

  if (number >= 10000000) {
    return "₹" + (number / 10000000).toFixed(2) + "Cr";
  } else {
    const isFractional = number % 1 !== 0;
    return (
      "₹" +
      number.toLocaleString("en-IN", {
        minimumFractionDigits: isFractional ? 2 : 0,
        maximumFractionDigits: 2,
      })
    );
  }
}

export const cleanFloat = (
  val,
  cfg = { threshold: 0.01, epsilon: 1e-10, decimals: 4 }
) => {
  if (Number.isInteger(val)) return val;

  const { threshold, epsilon, decimals } = cfg;
  logStart("cleanFloat", { val, cfg });
  if (Math.abs(val) < epsilon) {
    logResult("cleanFloat", 0);
    return 0;
  }

  const fractional = Math.abs(val % 1);
  const nearInteger = fractional <= threshold || fractional >= 1 - threshold;

  const rounded = nearInteger ? Math.round(val) : Number(val);
  const result = parseFloat(rounded.toFixed(decimals));
  logResult("cleanFloat", result);
  return result;
};

export const safe = (val, decimals = 4) => {
  if (isNaN(val) || !isFinite(val) || val === 0) return 0;
  if (Number.isInteger(val)) return val;

  const parsed = Number(parseFloat(val).toFixed(decimals));
  return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
};

export const formatValue = (val, { mode, direction = "ceil" }) => {
  if (isNaN(val) || !isFinite(val) || val === 0) return 0;
  if (Number.isInteger(val)) return val;

  const adjustBy = (percent) => val + safe((Math.abs(val) * percent) / 100);

  const isValidDirection = ["ceil", "floor", "round"].includes(direction);
  if (!isValidDirection) throw new Error("Invalid Direction: " + direction);

  const round = (v, t) =>
    Number(parseFloat(Math?.[direction](safe(v / t)) * t).toFixed(2));

  switch (mode) {
    case "Approx":
      return Number(parseFloat(val).toFixed(2));
    case "Buffer":
      return round(adjustBy(0.6), 0.05);
    case "Market":
      return round(val, 0.05);
    default:
      return val;
  }
};

export const roundKeys = (updates) => {
  logStart("roundKeys", updates);

  const preciseKeys = {};
  for (const key in updates) {
    const val = updates[key] ?? 0;
    preciseKeys[key] = key === "percent" ? safe(val) : cleanFloat(val);
  }

  logResult("roundKeys", preciseKeys);
  return preciseKeys;
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
