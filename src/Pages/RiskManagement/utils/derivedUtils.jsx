export const getDerivedObj = (section, price, isBuyPrice, derivedField) => {
  console.groupCollapsed(`%c[getDerivedObj]`, "color: #d3ff63ff;");

  const { name, buyPrice, sellPrice, pts } = section;

  console.log("Section:", name);
  console.log(isBuyPrice ? "buyPrice:" : "sellPrice:", price);

  const getCalculatedPts = () => {
    const diff = isBuyPrice ? sellPrice - price : price - buyPrice;

    if (name === "calculator") {
      console.log("calculator → using raw difference");
      return diff;
    } else if (name === "target") {
      console.log("target → using condition: diff < 0 ? pts : diff");
      return diff < 0 ? pts : diff;
    } else {
      console.log("stoploss → using condition: diff > 0 ? pts : diff");
      return diff > 0 ? pts : diff;
    }
  };

  const ptsBySec = getCalculatedPts();
  const isBuyLock = derivedField === "buyPrice";
  const isAmountLock = derivedField === "amount";
  const newPtsObj = { pts: ptsBySec };

  console.log("→ Calculated Pts:", ptsBySec);
  console.log("→ Derived Field:", derivedField);

  let result;

  if (isAmountLock) {
    result = newPtsObj;
  } else if (isBuyPrice) {
    result = isBuyLock ? newPtsObj : { sellPrice: pts + price };
  } else {
    result = isBuyLock ? { buyPrice: price - pts } : newPtsObj;
  }

  console.log("[getDerivedObj] result:", result);
  console.groupEnd();
  return result;
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
