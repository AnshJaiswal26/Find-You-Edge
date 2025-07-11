import React from "react";

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

export const calculateAllCharges = (field, qty, buyVal, sellVal, tradeVal) => {
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
      const others = calculateAllCharges(
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

  return calculateAllCharges(
    "totalCharges",
    section.qty,
    buyValue,
    sellValue,
    tradeValue
  );
};

const getUpdatedPts = (section, updatedPrice, isBuyPrice) => {
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

export const handleChange = (context) => {
  const { section, field, val, update, getterMap, timeOut, refine, round } =
    context;
  const formatter = section.name === "calculator" ? refine : round;

  const other = getterMap["other"];
  const calculator = getterMap["calculator"];
  const target = getterMap["target"];
  const stopLoss = getterMap["stopLoss"];

  console.log(val);

  if (handleSpecialCases(section, field, val, false, update)) return;

  const numericValue = val === "" ? 0 : Number(val);

  if (other.capital === 0 && field === "percent") {
    timeOut("other", "capital");
    return;
  }
  const calcPercent = (amt) => (amt / other.capital) * 100;

  const fieldHandlers = {
    buyPrice: handlePriceChange,
    sellPrice: handlePriceChange,
    capital: handleCapitalChange,
    rr: handleRiskRewardChange,
    qty: handleQtyChange,
    pts: handleAmountOrPtsChange,
    amount: handleAmountOrPtsChange,
    percent: handlePercentChange,
    addQty: handleAddQtyChange,
    priceAchieved: handlePriceAchievedChange,
    rrAchieved: handleRiskRewardAchievedChange,
  };

  const updated = fieldHandlers[field](section, field, numericValue, false);
  if (updated?.section) update(section.name, updated.section);
  if (updated?.transaction) update("transaction", updated.transaction);

  function updateOppositeSection(name, val, price, show, isRecursive) {
    const handleSectionUpdates = (secName, condition, xSection) => {
      timeOut(secName, condition, 0, show);

      if (!isRecursive) {
        const calcByRR = () => {
          const posVal = Math.abs(val);
          const newPts =
            secName === "target" ? -posVal / other.rr : posVal * other.rr;
          return newPts;
        };
        const isChangeByRR = field === "qty" || field === "buyPrice";
        const newVal = isChangeByRR ? val : calcByRR();
        update(
          xSection.name,
          fieldHandlers[field](xSection, field, price + newVal, true)
        );
      }
    };

    if (name === "target") handleSectionUpdates(name, "greater", stopLoss);
    if (name === "stopLoss") handleSectionUpdates(name, "less", target);
  }

  function handleCapitalChange() {
    const newCapital = Math.max(0, numericValue);

    const updated = {
      calcPer: refine((calculator.amount / newCapital) * 100),
      targetPer: refine((target.amount / newCapital) * 100),
      sLPer: refine((stopLoss.amount / newCapital) * 100),
    };

    update("calculator", { percent: updated.calcPer });
    update("target", { percent: updated.targetPer });
    update("stopLoss", { percent: updated.sLPer });

    update("other", { capital: newCapital });
    return null;
  }

  function handleRiskRewardChange() {
    const updatedRR = Math.max(0, numericValue);

    const updated = handleAmountOrPtsChange(
      target,
      "pts",
      stopLoss.pts * -updatedRR,
      true
    );
    update("target", updated);
    update("other", { rr: updatedRR });
    return null;
  }

  function handlePriceChange(section, field, val, isRecursive = false) {
    const { name, buyPrice, qty, amount } = section;

    const isBuyPrice = field === "buyPrice";
    const updatedPrice = Math.max(0, val);
    const updated = {
      [field]: formatter(updatedPrice),
      pts: formatter(getUpdatedPts(section, updatedPrice, isBuyPrice)),
    };

    if (isBuyPrice) {
      const sellPrice = formatter(amount / qty + updatedPrice);
      updated.sellPrice = sellPrice;
      updated.pts = formatter(sellPrice - updatedPrice);
    } else {
      updated.amount = formatter(updated.pts * qty);
      updated.percent = formatter(calcPercent(updated.amount), 0);
    }

    if (name === "target" || name === "stopLoss")
      updateOppositeSection(
        name,
        isBuyPrice ? updatedPrice : updated.pts,
        isBuyPrice ? 0 : buyPrice,
        updated.pts === 0,
        isRecursive
      );
    if (isRecursive) return updated;

    return {
      section: updated,
      transaction: {
        [field]: formatter(updatedPrice),
        ...(updated.sellPrice !== undefined && {
          sellPrice: updated.sellPrice,
        }),
        qty: qty,
      },
    };
  }

  function handleQtyChange(section, field, val, isRecursive = false) {
    const { name, buyPrice, amount } = section;

    const updatedQty = Math.max(0, val);
    const updated = { qty: updatedQty };
    updated.pts = formatter(amount / updatedQty);
    updated.sellPrice = formatter(buyPrice + updated.pts);
    updated.percent = formatter(calcPercent(amount), 0);

    if (name === "target" || name === "stopLoss")
      updateOppositeSection(
        name,
        updatedQty,
        0,
        updated.pts === 0,
        isRecursive
      );
    if (isRecursive) return updated;

    return {
      section: updated,
      transaction: {
        buyPrice: buyPrice,
        sellPrice: updated.sellPrice,
        qty: updatedQty,
      },
    };
  }

  function handleAmountOrPtsChange(section, field, val, isRecursive = false) {
    const { name, buyPrice, qty } = section;

    const isPts = field === "pts";
    const newValue = val;
    const value =
      name === "calculator"
        ? newValue
        : name === "stopLoss"
        ? newValue > 0
          ? -newValue
          : newValue
        : Math.max(0, newValue);

    const updated = { pts: isPts ? formatter(value) : formatter(value / qty) };
    updated.amount = isPts ? formatter(value * qty) : formatter(value);
    updated.sellPrice = formatter(updated.pts + buyPrice);
    updated.percent = formatter(calcPercent(updated.amount), 0);

    if (name === "target" || name === "stopLoss")
      updateOppositeSection(name, value, 0, updated.pts === 0, isRecursive);
    if (isRecursive) return updated;

    return {
      section: updated,
      transaction: {
        sellPrice: updated.sellPrice,
      },
    };
  }

  function handlePercentChange(section, field, val, isRecursive = false) {
    const { name, buyPrice, qty } = section;

    const updatedPercent =
      name === "calculator"
        ? val
        : name === "stopLoss"
        ? val > 0
          ? -val
          : val
        : Math.max(0, val);

    const updated = {
      percent: formatter(updatedPercent, 0),
    };
    updated.amount = formatter(other.capital * (updated.percent / 100));
    updated.pts = formatter(updated.amount / qty);
    updated.sellPrice = formatter(buyPrice + updated.pts);

    if (name === "target" || name === "stopLoss")
      updateOppositeSection(
        name,
        updatedPercent,
        0,
        updated.pts === 0,
        isRecursive
      );
    if (isRecursive) return updated;

    return {
      section: updated,
      transaction: {
        sellPrice: updated.sellPrice,
      },
    };
  }

  function handleAddQtyChange(section, field, val, isRecursive = false) {
    const row = section.table.rows[section.currentLayer];

    if (row[section.at] === 0) {
      timeOut("pyramiding", "achieved", 5000);
      return;
    }

    const updatedQty = Math.max(0, val);
  }

  function handlePriceAchievedChange(
    section,
    field,
    val,
    isRecursive = false
  ) {}

  function handleRiskRewardAchievedChange(
    section,
    field,
    val,
    isRecursive = false
  ) {}
};
