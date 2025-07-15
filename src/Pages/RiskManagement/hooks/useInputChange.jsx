import {
  useRiskCalculator,
  useCalculator,
  useNote,
  useTransaction,
} from "../context/context";
import { handleSpecialCases } from "../utils/utils";
import {
  useAmountAndPtsHandler,
  useCapitalHandler,
  usePercentHandler,
  usePriceHandler,
  useQtyHandler,
  useRiskRewardHandler,
} from "./handlers/handlers";

export function useInputChange() {
  const { updateCalculator } = useCalculator();
  const { capital, updateRiskCalculator } = useRiskCalculator();
  const { updateTransaction } = useTransaction();
  const { timeOut } = useNote();

  const handlePriceChange = usePriceHandler();
  const handleAmountOrPtsChange = useAmountAndPtsHandler();

  const fieldHandlers = {
    capital: useCapitalHandler(),
    ratio: useRiskRewardHandler(),
    buyPrice: handlePriceChange,
    sellPrice: handlePriceChange,
    qty: useQtyHandler(),
    pts: handleAmountOrPtsChange,
    amount: handleAmountOrPtsChange,
    percent: usePercentHandler(),
  };

  const handleChange = (section, field, val) => {
    const updateSection =
      section.name === "calculator" ? updateCalculator : updateRiskCalculator;
    console.log(field);

    if (handleSpecialCases(section, field, val, false, updateSection)) return;

    const numericValue = val === "" ? 0 : Number(val);

    if (capital.current === 0 && field === "percent") {
      timeOut("capital", "current");
      return;
    }
    if (typeof fieldHandlers[field] === "function") {
      fieldHandlers[field](section, field, numericValue);
    } else {
      console.warn(`Missing field handler for "${field}"`);
    }

    const updated = fieldHandlers[field](section, field, numericValue);
    if (updated?.section) updateSection(section.name, updated.section);
    if (updated?.transaction) updateTransaction(updated.transaction);
  };

  return { handleChange };
}
