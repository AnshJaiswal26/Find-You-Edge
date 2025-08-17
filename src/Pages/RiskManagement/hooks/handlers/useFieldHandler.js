import { useMemo } from "react";
import {
  useAmountAndPtsHandler,
  useCapitalHandler,
  usePercentHandler,
  usePositionSizingHandler,
  usePriceHandler,
  useQtyHandler,
  useRiskRewardHandler,
} from ".";

export default function useFieldHandler() {
  const handlePriceChange = usePriceHandler();
  const handleAmountOrPtsChange = useAmountAndPtsHandler();
  const capitalHandler = useCapitalHandler();
  const riskRewardHandler = useRiskRewardHandler();
  const qtyHandler = useQtyHandler();
  const percentHandler = usePercentHandler();
  const handlePositionSizingChange = usePositionSizingHandler();

  const fieldHandlers = useMemo(
    () => ({
      current: capitalHandler,
      ratio: riskRewardHandler,
      buyPrice: handlePriceChange,
      sellPrice: handlePriceChange,
      qty: qtyHandler,
      pts: handleAmountOrPtsChange,
      amount: handleAmountOrPtsChange,
      percent: percentHandler,
      lotSize: handlePositionSizingChange,
      slPts: handlePositionSizingChange,
      riskAmount: handlePositionSizingChange,
      riskPercent: handlePositionSizingChange,
    }),
    [
      capitalHandler,
      riskRewardHandler,
      handlePriceChange,
      handleAmountOrPtsChange,
      qtyHandler,
      percentHandler,
      handlePositionSizingChange,
    ]
  );

  return fieldHandlers;
}
