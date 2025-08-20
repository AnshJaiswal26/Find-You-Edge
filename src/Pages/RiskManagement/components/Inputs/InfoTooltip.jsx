import { Tooltip } from "@components";
import { useRiskManagementStore } from "@RM/stores";
import { is } from "@RM/utils";

export function InfoTooltip({ name, field }) {
  const derived = useRiskManagementStore((s) => s.settings.derived);
  const isHovered = useRiskManagementStore(
    (s) => s.hoveredInput === `${name}_${field}`
  );

  const isReadOnly = field === "suggestedQty" || field === "adjustedSl";
  const isRiskAmtOrPercent = field === "riskPercent" || field === "riskAmount";
  const derivedInput = derived.input;
  const isDerived = derivedInput === field;
  const isAdjust = derived.adjust === field && derivedInput === "amount";

  const getTitle = () => {
    return [
      isReadOnly ? "🔒 Read Only" : "✏️ Input",
      isDerived && "🎯 Derived Input",
      (isAdjust ||
        isDerived ||
        isReadOnly ||
        isRiskAmtOrPercent ||
        is.PAP(field)) &&
        "🔄 Auto-Calculated",
    ];
  };

  return (
    // <RenderLogger id={`Lablel-(${field})`}>
    <Tooltip
      data={getTitle()}
      isVisible={isHovered}
      position={
        is.BSQ(field) || isReadOnly || field === "lotSize" ? "top" : "bottom"
      }
    />
    // </RenderLogger>
  );
}
