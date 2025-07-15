export function formatINR(num) {
  const number = parseFloat(num).toFixed(2);
  const newNum = number % 1 === 0 ? parseInt(number) : number;
  const isFractional = newNum.toString().includes(".");
  return (
    "₹ " +
    Number(newNum).toLocaleString("en-IN", {
      minimumFractionDigits: isFractional ? 2 : 0,
      maximumFractionDigits: 2,
    })
  );
}

export const formatValue = (val, mode, cfg) => {
  if (isNaN(val) || !isFinite(val)) return 0;
  const parsed = Number(val);
  if (cfg === 0) return Number(parseFloat(parsed).toFixed(2));
  const parser1 = (d) => Number(parseFloat(parsed).toFixed(d));
  const parser2 = (tick) =>
    Number(
      parseFloat(
        (parsed < 0 ? Math.floor(parsed / tick) : Math.ceil(parsed / tick)) *
          tick
      ).toFixed(2)
    );

  switch (mode) {
    case "approx":
      return parser1(2);
    case "precise":
      return parser1(4);
    case "buffer":
      return parser2(0.1);
    case "market":
      return parser2(0.05);
    default:
      return parsed;
  }
};

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

export const getUpdatedPts = (section, updatedPrice, isBuyPrice) => {
  if (section.name === "calculator") {
    return isBuyPrice
      ? section.sellPrice - updatedPrice
      : updatedPrice - section.buyPrice;
  }
  if (section.name === "target") {
    if (isBuyPrice)
      return updatedPrice < section.sellPrice
        ? section.sellPrice - updatedPrice
        : 0;
    else
      return section.buyPrice < updatedPrice
        ? updatedPrice - section.buyPrice
        : 0;
  } else {
    if (isBuyPrice)
      return updatedPrice > section.sellPrice
        ? section.sellPrice - updatedPrice
        : 0;
    else
      return section.buyPrice > updatedPrice
        ? updatedPrice - section.buyPrice
        : 0;
  }
};

export const handleSpecialCases = (
  section,
  field,
  val,
  onBlur = false,
  update
) => {
  const numericValue = Number(val);
  const isDot = val === ".";
  const isDash = val === "-";
  const hasTrailingZerosOrDot = /^-?\d+\.$|^-?\d+\.0{1,4}$/.test(val);
  const hasOnlyTrailingZeros = /\d+\.(?:0+)$/.test(val);
  const isNegFormat = val.startsWith("-.") || val.startsWith("0-");
  const isNegField =
    section.name === "calculator" &&
    ["pts", "amount", "percent"].includes(field);

  const updateSection = (newValue, isPrevVal = false) => {
    if (section.name !== "pyramiding") {
      update(section.name, {
        [field]: newValue,
        ...(isPrevVal && {
          prevVal: hasOnlyTrailingZeros ? section.prevVal : section[field],
        }),
      });
    } else {
      const row = section.table.rows[section.currentLayer];
      if ((row[field] = newValue)) return true;
      const updatedRow = {
        [field]: newValue,
      };
      update("pyramiding", {
        table: {
          ...section.table,
          rows: section.table.rows.map((r, i) =>
            i === section.currentLayer ? { ...r, ...updatedRow } : r
          ),
        },
        ...(isPrevVal && {
          prevVal: hasOnlyTrailingZeros ? section.prevVal : row[field],
        }),
      });
    }
    return true;
  };

  if (isNegField && isNegFormat) return updateSection("-");

  if (onBlur)
    return updateSection(
      isDot
        ? 0
        : val.endsWith(".") || hasOnlyTrailingZeros || isDash
        ? section.prevVal
        : numericValue
    );

  if (hasTrailingZerosOrDot || isDash) return updateSection(val, true);

  if (!/^-?\d*\.?\d*$/.test(val) && val !== "") return true;

  return false;
};

export const getPtsByRatio = (isTarget, val, ratio) => {
  const pts = Math.abs(val);
  const newPts = isTarget ? -pts / ratio : pts * ratio;
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
