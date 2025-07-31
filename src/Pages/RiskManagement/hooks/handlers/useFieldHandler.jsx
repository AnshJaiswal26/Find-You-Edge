import { useMemo } from "react";
import {
  useAmountAndPtsHandler,
  useCapitalHandler,
  usePercentHandler,
  usePriceHandler,
  useQtyHandler,
  useRiskRewardHandler,
} from "./";

export default function useFieldHandler() {
  const handlePriceChange = usePriceHandler();
  const handleAmountOrPtsChange = useAmountAndPtsHandler();
  const capitalHandler = useCapitalHandler();
  const riskRewardHandler = useRiskRewardHandler();
  const qtyHandler = useQtyHandler();
  const percentHandler = usePercentHandler();

  const fieldHandlers = useMemo(
    () => ({
      capital: capitalHandler,
      ratio: riskRewardHandler,
      buyPrice: handlePriceChange,
      sellPrice: handlePriceChange,
      qty: qtyHandler,
      pts: handleAmountOrPtsChange,
      amount: handleAmountOrPtsChange,
      percent: percentHandler,
    }),
    [
      capitalHandler,
      riskRewardHandler,
      handlePriceChange,
      handleAmountOrPtsChange,
      qtyHandler,
      percentHandler,
    ]
  );

  return fieldHandlers;
}
