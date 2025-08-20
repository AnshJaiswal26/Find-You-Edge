import { useMemo, useRef } from "react";
import { debounce } from "lodash";
import "./Inputs.css";
import { useRiskManagementStore } from "@RM/stores";
import { useInputChange, useSpecialCaseHandler } from "@RM/hooks";
import { ValidationTooltip } from "@components";
import { is, logMsg, logObj } from "@RM/utils";
import RenderLogger from "@Profiler";
import { fieldColors } from "@RM/data";
import { InfoTooltip } from "./InfoTooltip";

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
  enableTooltip,
  readOnly,
}) {
  const handleChange = useInputChange();
  const handleSpecialCases = useSpecialCaseHandler();

  const setHoveredInput = useRiskManagementStore((s) => s.update.hoveredInput);
  const showTooltip = useRiskManagementStore((s) => s.update.tooltip);
  const tooltip = useRiskManagementStore(
    (s) => s?.[sectionName + "Tooltip"]?.[field]
  );
  const isFlashing = useRiskManagementStore(
    (s) => s?.[sectionName + "Flash"]?.[field]
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

  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    setHoveredInput(`${sectionName}_${field}`);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHoveredInput(null);
      timeoutRef.current = null;
    }, 3000);
  };

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
            const section = useRiskManagementStore.getState()[sectionName];
            handleSpecialCases(section, field, e.target.value, true);
          }}
          onMouseEnter={handleMouseEnter}
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
