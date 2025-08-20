import { useMemo } from "react";
import {
  useCapitalHandler,
  usePositionSizingHandler,
  usePriceHandler,
  usePtsAmountAndPercentHandler,
  useQtyHandler,
  useRiskRewardHandler,
} from ".";

export default function useFieldHandler() {
  const handlePriceChange = usePriceHandler();
  const handlePtsAmountAndPercentChange = usePtsAmountAndPercentHandler();
  const capitalHandler = useCapitalHandler();
  const riskRewardHandler = useRiskRewardHandler();
  const qtyHandler = useQtyHandler();
  const handlePositionSizingChange = usePositionSizingHandler();

  const fieldHandlers = useMemo(
    () => ({
      current: capitalHandler,
      ratio: riskRewardHandler,
      buyPrice: handlePriceChange,
      sellPrice: handlePriceChange,
      qty: qtyHandler,
      pts: handlePtsAmountAndPercentChange,
      amount: handlePtsAmountAndPercentChange,
      percent: handlePtsAmountAndPercentChange,
      lotSize: handlePositionSizingChange,
      slPts: handlePositionSizingChange,
      riskAmount: handlePositionSizingChange,
      riskPercent: handlePositionSizingChange,
    }),
    [
      capitalHandler,
      riskRewardHandler,
      handlePriceChange,
      handlePtsAmountAndPercentChange,
      qtyHandler,
      handlePositionSizingChange,
    ]
  );

  return fieldHandlers;
}
