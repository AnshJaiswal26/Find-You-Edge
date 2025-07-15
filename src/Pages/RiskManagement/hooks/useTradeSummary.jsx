import { useRefiners } from "./useRefiners";
import { calculateCharges } from "../utils/utils";
import { useTransaction } from "../context/context";

export function useTradeSummary() {
  const { transaction } = useTransaction();
  const { refine } = useRefiners();

  const qty = transaction.qty;
  const buyVal = refine(transaction.buyPrice * qty);
  const sellVal = refine(transaction.sellPrice * qty);
  const tradeVal = refine(buyVal + sellVal);

  const calculate = (field) =>
    calculateCharges(field, qty, buyVal, sellVal, tradeVal);

  const netPL = refine(sellVal - buyVal - calculate("totalCharges"), 0);
  const netPLPercent = refine((netPL / buyVal) * 100, 0);
  const totalCharges = calculate("totalCharges");

  return {
    tradeVal,
    buyVal,
    sellVal,
    grossPL: refine(sellVal - buyVal),
    netPL,
    netPLPercent,
    breakevenPts: refine(totalCharges / qty, 0),
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
