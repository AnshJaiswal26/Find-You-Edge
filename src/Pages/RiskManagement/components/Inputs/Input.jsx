import { useMemo, useState } from "react";
import { debounce } from "lodash";
import "./Inputs.css";
import { useRiskManagementStore } from "@RM/stores";
import { useInputChange, useSpecialCaseHandler } from "@RM/hooks";
import { Tooltip, ValidationTooltip } from "@components";
import { is } from "@RM/utils";
import RenderLogger from "@Profiler";

export default function Input({
  className,
  label,
  sectionName,
  field,
  value,
  enableTooltip = true,
}) {
  return (
    <>
      <Label label={label} field={field} />
      <NormalInput
        className={className}
        sectionName={sectionName}
        field={field}
        value={value}
        enableTooltip={enableTooltip}
      />
    </>
  );
}

function NormalInput({ className, sectionName, field, value, enableTooltip }) {
  const handleChange = useInputChange();
  const handleSpecialCases = useSpecialCaseHandler();

  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);
  const tooltip = useRiskManagementStore((s) => s.tooltip[sectionName][field]);
  const fieldFlash = useRiskManagementStore(
    (s) => s.flash?.[sectionName]?.[field]
  );

  const currentVal = useRiskManagementStore((s) => s[sectionName][field]);

  const isCapital = sectionName === "capital";

  const color =
    is.PAP(field) &&
    (currentVal < 0 ? "red" : currentVal > 0 ? "green" : "neutral");

  const debouncedChange = useMemo(
    () =>
      debounce((sectionName, field, val) => {
        handleChange(sectionName, field, val);
      }, 20),
    [handleChange]
  );

  return (
    <RenderLogger id={`NormalInput`} why={`${sectionName}.${field}`}>
      <input
        className={`risk-input ${field} ${className} ${
          tooltip ? tooltip?.type : ""
        } input-${color} ${fieldFlash ? "flashing" : ""}`}
        type="text"
        value={value ?? currentVal}
        onChange={(e) => {
          debouncedChange(sectionName, field, e.target.value);
        }}
        onBlur={(e) => {
          handleSpecialCases(sectionName, field, e.target.value, true);
        }}
      />
      {tooltip && enableTooltip && (
        <ValidationTooltip
          type={tooltip.type ?? "error"}
          message={tooltip.message}
          position={tooltip.position}
          isVisible={true}
          autoHide={isCapital}
          onClose={() => showTooltip(sectionName, { [field]: null })}
          showCloseButton={isCapital}
        />
      )}
    </RenderLogger>
  );
}

function Label({ label, field }) {
  const derived = useRiskManagementStore((s) => s.settings.derived);

  const [isVisible, setVisiblity] = useState();

  const derivedInput = derived.input;
  const isDerived = derivedInput === field;
  const isAdjust = derived.adjust === field && derivedInput === "amount";

  const getTitle = () => {
    return [
      "✏️ Input",
      isDerived && "🎯 Derived Input",
      (isAdjust || isDerived || is.PAP(field)) && "🔄 Auto-Calculated",
    ];
  };

  return (
    // <RenderLogger id={`Lablel-(${field})`}>
    <div
      className="risk-label"
      onMouseEnter={() => setVisiblity(true)}
      onMouseLeave={() => setVisiblity(false)}
    >
      <span>{label}</span>
      <Tooltip
        data={getTitle()}
        isVisible={isVisible}
        position={is.BSQ(field) ? "top" : "bottom"}
      />
    </div>
    // </RenderLogger>
  );
}
