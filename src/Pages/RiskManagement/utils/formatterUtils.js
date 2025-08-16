import { logEnd, logObj, logResult, logStart } from ".";

export function formatINR(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return "₹0";

  if (number >= 10000000) {
    // ₹1 Crore+
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
  const { threshold, epsilon, decimals } = cfg;
  logStart("cleanFloat", { val, cfg });
  if (Math.abs(val) < epsilon) {
    logResult("cleanFloat", 0);
    return 0;
  }

  const fractional = Math.abs(val % 1);
  const nearInteger = fractional <= threshold || fractional >= 1 - threshold;

  const rounded = nearInteger ? Math.round(val) : val;
  const result = parseFloat(rounded.toFixed(decimals));
  logResult("cleanFloat", result);
  return result;
};

export const safe = (val, d = 4) => {
  if (isNaN(val) || !isFinite(val) || val === 0) return 0;
  const parsed = Number(parseFloat(val).toFixed(d));
  return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
};

export const formatValue = (val, mode) => {
  if (isNaN(val) || !isFinite(val) || val === 0) return 0;

  const adjustBy = (percent) => val + (Math.abs(val) * percent) / 100;

  const roundToApprox = (decimals) => Number(parseFloat(val).toFixed(decimals));

  const roundToMarket = (tick) =>
    Number(parseFloat(Math.ceil(val / tick) * tick).toFixed(2));

  const roundToBuffer = (tick) => {
    const adjustedVal = adjustBy(0.6);
    return Number(parseFloat(Math.ceil(adjustedVal / tick) * tick).toFixed(2));
  };

  switch (mode) {
    case "Approx":
      return roundToApprox(2);
    case "Buffer":
      return roundToBuffer(0.05);
    case "Market":
      return roundToMarket(0.05);
    default:
      return val;
  }
};

export const roundKeys = (keys, updates) => {
  logStart("roundKeys", { keys, updates });
  const preciseUpdates = keys.reduce(
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
  );
  logResult("roundKeys", preciseUpdates);
  return preciseUpdates;
};
