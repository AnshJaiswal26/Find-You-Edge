import { useTransaction } from "@RM/context";
import { calculateCharges } from "@RM/utils";

export default function useTradeSummary() {
  const { transaction } = useTransaction();

  const qty = transaction.qty;
  const buyVal = transaction.buyPrice * qty;
  const sellVal = transaction.sellPrice * qty;
  const tradeVal = buyVal + sellVal;

  const calculate = (field) =>
    calculateCharges(field, qty, buyVal, sellVal, tradeVal);

  const totalCharges = calculate("totalCharges");
  const netPL = sellVal - buyVal - totalCharges;
  const netPLPercent = (netPL / buyVal) * 100;

  return {
    tradeVal,
    buyVal,
    sellVal,
    grossPL: sellVal - buyVal,
    netPL,
    netPLPercent,
    breakevenPts: totalCharges / qty,
    colorForPnl: netPL === 0 ? "neutral" : netPL > 0 ? "green" : "red",
    charges: {
      brokerage: calculate("brokerage"),
      eT: calculate("exchangeTransactionCharges"),
      dp: calculate("dpCharges"),
      stt: calculate("stt"),
      sebi: calculate("sebiCharges"),
      ipft: calculate("ipft"),
      stampDuty: calculate("stampDuty"),
      gst: calculate("gst"),
      others: calculate("otherCharges"),
      total: totalCharges,
    },
  };
}
