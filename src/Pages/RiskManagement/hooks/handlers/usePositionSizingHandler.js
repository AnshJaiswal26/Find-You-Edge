import { useRiskManagementStore } from "@RM/stores";
import { formatValue, safe } from "@RM/utils";

const calculateLockFields = (amt, slPts, lotSize) => {
  const suggestedQty = Math.round(safe(amt / slPts / lotSize)) * lotSize;
  const adjustedSl = safe(amt / suggestedQty);
  return {
    suggestedQty: suggestedQty,
    adjustedSl: formatValue(adjustedSl, { mode: "Market", direction: "floor" }),
  };
};

export default function usePositionSizingHandler() {
  const handlePositionSizingChange = ({ section, field, val }) => {
    const { name, lotSize, slPts, riskAmount } = section;
    const capital = useRiskManagementStore.getState().capital.current;

    const num = Math.abs(val);

    const isAmt = field === "riskAmount";
    const opposite = isAmt ? "riskPercent" : "riskAmount";

    const updated = { [field]: num };

    if (isAmt || field === "riskpercent") {
      updated[opposite] = isAmt
        ? safe(num / capital) * 100
        : safe(num / 100) * capital;
    }

    const readOnlyFields = calculateLockFields(
      updated.riskAmount ?? riskAmount,
      updated.slPts ?? slPts,
      updated.lotSize ?? lotSize
    );

    return { [name]: { ...updated, ...readOnlyFields } };
  };

  return handlePositionSizingChange;
}
