export const calculateCharges = (field, qty, buyVal, sellVal, tradeVal) => {
  if (buyVal === 0 && sellVal === 0) return 0;
  switch (field) {
    case "brokerage":
      return Math.min(qty ? 20 * 2 : 0);
    case "exchangeTransactionCharges":
      return 0.0003503 * tradeVal;
    case "dpCharges":
      return 0;
    case "stt":
      return 0.001 * sellVal;
    case "sebiCharges":
      return 0.000001 * tradeVal;
    case "ipft":
      return 0.000005 * tradeVal;
    case "stampDuty":
      return 0.00003 * buyVal;
    case "gst": {
      const brokerage = Math.min(qty ? 20 * 2 : 0);
      const exchTxnCharges = 0.0003503 * tradeVal;
      return 0.18023 * (brokerage + exchTxnCharges);
    }
    case "otherCharges": {
      const charges = {
        exchTxn: 0.0003503 * tradeVal,
        dp: 0,
        stt: 0.001 * sellVal,
        sebi: 0.000001 * tradeVal,
        ipft: 0.000005 * tradeVal,
        stamp: 0.00003 * buyVal,
        gst: 0.18 * (Math.min(qty ? 20 * 2 : 0) + 0.0003503 * tradeVal),
      };
      return Object.values(charges).reduce((sum, charge) => sum + charge);
    }
    case "totalCharges": {
      const brok = Math.min(qty ? 20 * 2 : 0);
      const others = calculateCharges(
        "otherCharges",
        qty,
        buyVal,
        sellVal,
        tradeVal
      );
      return brok + others;
    }
    default:
      return 0;
  }
};

export const getNewCharges = (section, currentCharges) => {
  const pts = currentCharges / section.qty;
  const newSellPrice = section.sellPrice + pts;
  const buyValue = section.buyPrice * section.qty;
  const sellValue = newSellPrice * section.qty;
  const tradeValue = buyValue + sellValue;

  return calculateCharges(
    "totalCharges",
    section.qty,
    buyValue,
    sellValue,
    tradeValue
  );
};
