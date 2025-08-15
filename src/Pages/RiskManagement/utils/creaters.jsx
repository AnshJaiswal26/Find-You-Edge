import { fieldLabels } from "@RM/data";
import { is } from "./derivedUtils";
import { logInfo } from ".";
import { useSettingsStore } from "@RM/context";

const shouldBe = (f, sign) =>
  `${fieldLabels[f]} should be ${sign} than the ${is.oFU(f)}`;

export const generateTooltip = (field, key, mode) => {
  if (!key) return null;

  const derived = mode ?? useSettingsStore.getState().derived.input;

  const fieldHolder = fieldLabels[field];
  const isPriceOrQty = is.BSQ(field);

  const isAmountLock = derived === "amount";

  const holder = field !== "buyPrice" ? "positive" : "negative";

  const conditionalMsg = {
    negative: isAmountLock ? fieldHolder : "Buy/Sell Price",
    adjust: isAmountLock ? "amount change adjustment" : "derived input",
  };

  const createMessage = () => {
    switch (key) {
      case "zeroCapital":
        return "Enter Capital to calculate returns in %";
      case "negative":
        return `Derived ${fieldHolder} cannot be negative. Increase ${conditionalMsg.negative} or enter ${holder} values in Amount, Pts or Pnl(%) to correct.`;
      case "adjust":
        return `${fieldHolder} cannot be negative. Increase ${fieldHolder} or switch ${conditionalMsg.adjust} back to ${fieldHolder}.`;
      case "less":
        return `${fieldHolder} should be less than the ${is.oFU(field)}`;
      case "greater":
        return `${fieldHolder} should be greater than the ${is.oFU(field)}`;
    }
  };

  return {
    key: `${key}_${conditionalMsg[key]}`,
    type: key !== "zeroCapital" ? "error" : "info",
    position: isPriceOrQty ? "top" : "bottom",
    message: createMessage(),
  };
};

export const createFlash = () => ({
  buyPrice: false,
  sellPrice: false,
  qty: false,
  pts: false,
  amount: false,
  percent: false,
});

export const createMetrics = () => ({
  buyPrice: 0,
  sellPrice: 0,
  qty: 0,
  pts: 0,
  amount: 0,
  percent: 0,
});
