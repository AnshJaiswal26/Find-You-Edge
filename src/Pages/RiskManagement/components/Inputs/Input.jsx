import { useMemo } from "react";
import { debounce } from "lodash";
import "./Inputs.css";
import { useRiskManagementStore } from "@RM/stores";
import { useInputChange, useSpecialCaseHandler } from "@RM/hooks";
import { Tooltip, ValidationTooltip } from "@components";
import { is } from "@RM/utils";
import RenderLogger from "@Profiler";
import { fieldColors } from "@RM/data";

export default function Input({
  className,
  label,
  sectionName,
  field,
  enableTooltip = true,
  readOnly = false,
}) {
  return (
    <>
      <div className="risk-label">
        <span>{label}</span>
      </div>
      <NormalInput
        className={className}
        sectionName={sectionName}
        field={field}
        enableTooltip={enableTooltip}
        readOnly={readOnly}
      />
    </>
  );
}

function NormalInput({
  className,
  sectionName,
  field,
  value,
  enableTooltip,
  readOnly,
}) {
  const handleChange = useInputChange();
  const handleSpecialCases = useSpecialCaseHandler();

  const setHoveredInput = useRiskManagementStore((s) => s.update.hoveredInput);
  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);
  const tooltip = useRiskManagementStore(
    (s) => s.tooltip?.[sectionName]?.[field]
  );
  const isFlashing = useRiskManagementStore(
    (s) => s.flash?.[sectionName]?.[field]
  );

  const currentVal = useRiskManagementStore((s) => s?.[sectionName]?.[field]);

  const isCapital = sectionName === "capital";

  const color = is.PAP(field)
    ? currentVal < 0
      ? "red"
      : currentVal > 0
      ? "green"
      : "neutral"
    : fieldColors[field];

  const debouncedChange = useMemo(
    () =>
      debounce((sectionName, field, val) => {
        handleChange(sectionName, field, val);
      }, 20),
    [handleChange]
  );

  return (
    <>
      <RenderLogger id={`NormalInput`} why={`${sectionName}.${field}`}>
        <input
          className={`risk-input ${className} ${
            tooltip ? tooltip?.type : ""
          } input-${color} ${isFlashing ? "flashing" : ""}`}
          type="text"
          value={field === "ratio" ? "1 : " + currentVal : currentVal}
          onChange={(e) => {
            debouncedChange(sectionName, field, e.target.value);
          }}
          onBlur={(e) => {
            handleSpecialCases(sectionName, field, e.target.value, true);
          }}
          onMouseEnter={() => setHoveredInput(`${sectionName}_${field}`)}
          onMouseLeave={() => setHoveredInput(null)}
          readOnly={readOnly}
        />
      </RenderLogger>
      {tooltip && enableTooltip && (
        <RenderLogger id={`ValidationTooltip`} why={`${sectionName}.${field}`}>
          <ValidationTooltip
            type={tooltip.type ?? "error"}
            message={tooltip.message}
            position={tooltip.position}
            isVisible={true}
            autoHide={isCapital}
            onClose={() => showTooltip(sectionName, { [field]: null })}
            showCloseButton={isCapital}
          />
        </RenderLogger>
      )}
      <InfoTooltip name={sectionName} field={field} />
    </>
  );
}

function InfoTooltip({ name, field }) {
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
