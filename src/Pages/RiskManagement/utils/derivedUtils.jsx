export const getDerivedObj = (section, price, isBuyPrice, derivedField) => {
  const { name, buyPrice, sellPrice, pts } = section;

  const getCalculatedPts = () => {
    const diff = isBuyPrice ? sellPrice - price : price - buyPrice;

    if (name === "calculator") return diff;
    else if (name === "target") return diff < 0 ? pts : diff;
    else return diff > 0 ? pts : diff;
  };

  const ptsBySec = getCalculatedPts();
  const isBuyLock = derivedField === "buyPrice";
  const isAmountLock = derivedField === "amount";
  const newPtsObj = { pts: ptsBySec };

  if (isAmountLock) return newPtsObj;

  if (isBuyPrice) return isBuyLock ? newPtsObj : { sellPrice: pts + price };
  else return isBuyLock ? { buyPrice: price - pts } : newPtsObj;
};

export const getPtsByRatio = (isTarget, val, ratio) => {
  const amt = Math.abs(val);
  const newPts = isTarget ? -amt / ratio : amt * ratio;
  return newPts;
};

export const getValBySecName = (name, val) =>
  name === "calculator"
    ? val
    : name === "stopLoss"
    ? val > 0
      ? -val
      : val
    : Math.max(0, val);
