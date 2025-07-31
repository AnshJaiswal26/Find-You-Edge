import { useMemo } from "react";
import { useNote } from "../context/NoteContext";
import { useSettings } from "../context/SettingsContext";

export default function useSectionData(section) {
  const { note } = useNote();
  const { settings } = useSettings();

  const derivedField = settings.derived.mode === "amount";
  const { name, labels } = section;

  const isTarget = name === "target";
  const isSl = name === "stopLoss";

  const is = useMemo(
    () => ({
      buyPriceLesser: note[name]?.buyPriceLesser,
      buyPriceGreater: note[name]?.buyPriceGreater,
      sellPriceLesser: note[name]?.sellPriceLesser,
      sellPriceGreater: note[name]?.sellPriceGreater,
      buyPriceNeg: note[name]?.buyPriceNeg,
      sellPriceNeg: note[name]?.sellPriceNeg,
      buyPrice: note[name]?.buyPrice,
      sellPrice: note[name]?.sellPrice,
      qty: note[name]?.qty,
      pts: note[name]?.pts,
      amount: note[name]?.amount,
      percent: note[name]?.percent,
    }),
    [note, name]
  );

  const price = is.buyPriceNeg ? "Buy" : "Sell";
  const oppoPrice = is.buyPriceNeg ? "Sell" : "Buy";
  const otherMsg = is.buyPriceNeg ? "Decrease" : "Increase";

  const inputData = useMemo(
    () => [
      {
        label: "Buy Price",
        field: "buyPrice",
        className:
          ((is.buyPriceNeg || is.buyPriceLesser || is.buyPriceGreater) &&
            "invalid") ||
          (is.buyPrice && "warning"),
        note: [
          {
            message: `Derived Sell Price is negative. Increase Buy Price, or modify Qty/Amount to rebalance the calculation.`,
            show: is.buyPrice,
            type: "warning",
            position: "top",
          },
          {
            message: `Buy Price cannot be negative ${
              derivedField
                ? "adjust Pts or Amount or Pnl(%) to rebalance the calculation."
                : ""
            }`,
            show: is.buyPriceNeg,
            position: "top",
          },
          isTarget && {
            message: "Buy Price should be less than the Sell Price",
            show: is.buyPriceLesser,
            position: "top",
          },
          isSl && {
            message: "Buy Price should be greater than the Sell Price",
            position: "top",
            show: is.buyPriceGreater,
          },
        ],
      },
      {
        label: "Sell Price",
        field: "sellPrice",
        className:
          ((is.sellPriceNeg || is.sellPriceLesser || is.sellPriceGreater) &&
            "invalid") ||
          (is.sellPrice && "warning"),
        note: [
          {
            message: `Derived Buy Price is negative. Increase Sell Price, or modify Qty/Amount to rebalance the calculation.`,
            show: is.sellPrice,
            type: "warning",
            position: "top",
          },
          {
            message: `Sell Price cannot be negative ${
              derivedField
                ? "adjust Pts or Amount or Pnl(%) to rebalance the calculation."
                : ""
            }`,
            show: is.sellPriceNeg,
            position: "top",
          },
          isTarget && {
            message: "Sell Price should be greater than the Buy Price",
            show: is.sellPriceGreater,
            position: "top",
          },
          isSl && {
            message: "Sell Price should be less than the Buy Price",
            position: "top",
            show: is.sellPriceLesser,
          },
        ],
      },
      {
        label: "Qty",
        field: "qty",
        className: is.qty && "warning",
        note: [
          {
            message: `Derived ${price} Price is negative. Increase Qty, or modify ${oppoPrice} Price/Amount to rebalance the calculation.`,
            show: is.qty,
            type: "warning",
            position: "top",
          },
        ],
      },
      {
        label: labels[0],
        field: "pts",
        className: is.pts && "warning",
        note: [
          {
            message: `Derived ${price} Price is negative. ${otherMsg} Pts, or modify ${oppoPrice} Price/Qty to rebalance the calculation.`,
            show: is.pts,
            type: "warning",
            position: "bottom",
          },
        ],
      },
      {
        label: "Amount",
        field: "amount",
        className: is.amount && "warning",
        note: [
          {
            message: `Derived ${price} Price is negative. ${otherMsg} Amount, or modify ${oppoPrice} Price/Qty to rebalance the calculation.`,
            show: is.amount,
            type: "warning",
            position: "bottom",
          },
        ],
      },
      {
        label: "PnL (%)",
        field: "percent",
        className: is.percent && "warning",
        note: [
          {
            message: `Derived ${price} Price is negative. ${otherMsg} Percent, or modify ${oppoPrice} Price/Qty to rebalance the calculation.`,
            show: is.percent,
            type: "warning",
            position: "bottom",
          },
        ],
      },
    ],
    [is, labels, price, oppoPrice, otherMsg, isTarget, isSl]
  );

  return inputData;
}
