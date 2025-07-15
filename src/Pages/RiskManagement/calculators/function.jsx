// import React from "react";



// export const handleChange = (context) => {
//   const { section, field, val } = context;

//   console.log(val);

//   if (handleSpecialCases(section, field, val, false, update)) return;

//   const numericValue = val === "" ? 0 : Number(val);

//   if (capital === 0 && field === "percent") {
//     timeOut("other", "capital");
//     return;
//   }
//   const calcPercent = (amt) => (amt / capital) * 100;

//   const fieldHandlers = {
//     buyPrice: handlePriceChange,
//     sellPrice: handlePriceChange,
//     capital: handleCapitalChange,
//     rr: handleRiskRewardChange,
//     qty: handleQtyChange,
//     pts: handleAmountOrPtsChange,
//     amount: handleAmountOrPtsChange,
//     percent: handlePercentChange,
//     addQty: handleAddQtyChange,
//     priceAchieved: handlePriceAchievedChange,
//     rrAchieved: handleRiskRewardAchievedChange,
//   };

//   const updated = fieldHandlers[field](section, field, numericValue, false);
//   if (updated?.section) update(section.name, updated.section);
//   if (updated?.transaction) update("transaction", updated.transaction);

//   function updateOppositeSection(name, val, price, show, isRecursive) {
//     const handleSectionUpdates = (secName, condition, xSection) => {
//       timeOut(secName, condition, 0, show);

//       if (!isRecursive) {
//         const calcByRR = () => {
//           const posVal = Math.abs(val);
//           const newPts =
//             secName === "target" ? -posVal / riskReward : posVal * riskReward;
//           return newPts;
//         };
//         const isChangeByRR = field === "qty" || field === "buyPrice";
//         const newVal = isChangeByRR ? val : calcByRR();
//         update(
//           xSection.name,
//           fieldHandlers[field](xSection, field, price + newVal, true)
//         );
//       }
//     };

//     if (name === "target") handleSectionUpdates(name, "greater", stopLoss);
//     if (name === "stopLoss") handleSectionUpdates(name, "less", target);
//   }

//   function handleCapitalChange() {
//     const newCapital = Math.max(0, numericValue);

//     const updated = {
//       calcPer: refine((calculator.amount / newCapital) * 100),
//       targetPer: refine((target.amount / newCapital) * 100),
//       sLPer: refine((stopLoss.amount / newCapital) * 100),
//     };

//     update("calculator", { percent: updated.calcPer });
//     update("target", { percent: updated.targetPer });
//     update("stopLoss", { percent: updated.sLPer });

//     update("other", { capital: newCapital });
//     return null;
//   }

//   function handleRiskRewardChange() {
//     const updatedRR = Math.max(0, numericValue);

//     const updated = handleAmountOrPtsChange(
//       target,
//       "pts",
//       stopLoss.pts * -updatedRR,
//       true
//     );
//     update("target", updated);
//     update("other", { rr: updatedRR });
//     return null;
//   }

//   function handlePriceChange(section, field, val, isRecursive = false) {
//     const { name, buyPrice, qty, amount } = section;

//     const isBuyPrice = field === "buyPrice";
//     const updatedPrice = Math.max(0, val);
//     const updated = {
//       [field]: formatter(updatedPrice),
//       pts: formatter(getUpdatedPts(section, updatedPrice, isBuyPrice)),
//     };

//     if (isBuyPrice) {
//       const sellPrice = formatter(amount / qty + updatedPrice);
//       updated.sellPrice = sellPrice;
//       updated.pts = formatter(sellPrice - updatedPrice);
//     } else {
//       updated.amount = formatter(updated.pts * qty);
//       updated.percent = formatter(calcPercent(updated.amount), 0);
//     }

//     if (name === "target" || name === "stopLoss")
//       updateOppositeSection(
//         name,
//         isBuyPrice ? updatedPrice : updated.pts,
//         isBuyPrice ? 0 : buyPrice,
//         updated.pts === 0,
//         isRecursive
//       );
//     if (isRecursive) return updated;

//     return {
//       section: updated,
//       transaction: {
//         [field]: formatter(updatedPrice),
//         ...(updated.sellPrice !== undefined && {
//           sellPrice: updated.sellPrice,
//         }),
//         qty: qty,
//       },
//     };
//   }

//   function handleQtyChange(section, field, val, isRecursive = false) {
//     const { name, buyPrice, amount } = section;

//     const updatedQty = Math.max(0, val);
//     const updated = { qty: updatedQty };
//     updated.pts = formatter(amount / updatedQty);
//     updated.sellPrice = formatter(buyPrice + updated.pts);
//     updated.percent = formatter(calcPercent(amount), 0);

//     if (name === "target" || name === "stopLoss")
//       updateOppositeSection(
//         name,
//         updatedQty,
//         0,
//         updated.pts === 0,
//         isRecursive
//       );
//     if (isRecursive) return updated;

//     return {
//       section: updated,
//       transaction: {
//         buyPrice: buyPrice,
//         sellPrice: updated.sellPrice,
//         qty: updatedQty,
//       },
//     };
//   }

//   function handleAmountOrPtsChange(section, field, val, isRecursive = false) {
//     const { name, buyPrice, qty } = section;

//     const isPts = field === "pts";
//     const newValue = val;
//     const value =
//       name === "calculator"
//         ? newValue
//         : name === "stopLoss"
//         ? newValue > 0
//           ? -newValue
//           : newValue
//         : Math.max(0, newValue);

//     const updated = { pts: isPts ? formatter(value) : formatter(value / qty) };
//     updated.amount = isPts ? formatter(value * qty) : formatter(value);
//     updated.sellPrice = formatter(updated.pts + buyPrice);
//     updated.percent = formatter(calcPercent(updated.amount), 0);

//     if (name === "target" || name === "stopLoss")
//       updateOppositeSection(name, value, 0, updated.pts === 0, isRecursive);
//     if (isRecursive) return updated;

//     return {
//       section: updated,
//       transaction: {
//         sellPrice: updated.sellPrice,
//       },
//     };
//   }

//   function handlePercentChange(section, field, val, isRecursive = false) {
//     const { name, buyPrice, qty } = section;

//     const updatedPercent =
//       name === "calculator"
//         ? val
//         : name === "stopLoss"
//         ? val > 0
//           ? -val
//           : val
//         : Math.max(0, val);

//     const updated = {
//       percent: formatter(updatedPercent, 0),
//     };
//     updated.amount = formatter(capital * (updated.percent / 100));
//     updated.pts = formatter(updated.amount / qty);
//     updated.sellPrice = formatter(buyPrice + updated.pts);

//     if (name === "target" || name === "stopLoss")
//       updateOppositeSection(
//         name,
//         updatedPercent,
//         0,
//         updated.pts === 0,
//         isRecursive
//       );
//     if (isRecursive) return updated;

//     return {
//       section: updated,
//       transaction: {
//         sellPrice: updated.sellPrice,
//       },
//     };
//   }

//   function handleAddQtyChange(section, field, val, isRecursive = false) {
//     const row = section.table.rows[section.currentLayer];

//     if (row[section.at] === 0) {
//       timeOut("pyramiding", "achieved", 5000);
//       return;
//     }

//     const updatedQty = Math.max(0, val);
//   }

//   function handlePriceAchievedChange(
//     section,
//     field,
//     val,
//     isRecursive = false
//   ) {}

//   function handleRiskRewardAchievedChange(
//     section,
//     field,
//     val,
//     isRecursive = false
//   ) {}
// };
