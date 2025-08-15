import { useCallback, useMemo, useRef, useState } from "react";
import "./Inputs.css";
import {
  useCalculatorStore,
  useSettingsStore,
  useTooltipStore,
} from "@RM/context";
import { useInputChange, useSpecialCaseHandler } from "@RM/hooks";
import { Tooltip, ValidationTooltip } from "@components";
import RenderLogger from "@Profiler";
import { debounce } from "lodash";
import { generateTooltip, is, logInfo, logObj } from "@RM/utils";

export default function Input({ className, label, sectionName, field, value }) {
  return (
    <>
      <Label label={label} field={field} />
      <NormalInput
        className={className}
        sectionName={sectionName}
        field={field}
        value={value}
      />
    </>
  );
}

function NormalInput({ className, sectionName, field, value }) {
  const handleChange = useInputChange();
  const handleSpecialCases = useSpecialCaseHandler();

  const priceTooltip = useTooltipStore((s) => s[sectionName][field]);
  const causedByTooltip = useTooltipStore((s) => {
    const tooltip = s[sectionName].causedBy;
    return tooltip?.for === field ? tooltip : null;
  });

  const tooltip = priceTooltip ?? causedByTooltip;

  const showNote = useTooltipStore((s) => s.showNote);
  const currentVal = useCalculatorStore((cxt) => cxt[sectionName][field]);
  const fieldFlash = useCalculatorStore(
    (cxt) => cxt.flash?.[sectionName]?.[field]
  );
  logObj("toolTip", sectionName + field);

  const isCapital = sectionName === "capital";

  const isValidField = is.PAP(field);
  const color =
    isValidField &&
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
          tooltip ? tooltip?.type ?? "error" : ""
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
      {tooltip && field !== "ratio" && (
        <ValidationTooltip
          type={tooltip.type ?? "error"}
          message={tooltip.message}
          position={tooltip.position}
          isVisible={true}
          autoHide={isCapital}
          onClose={() => showNote(sectionName, "none")}
          showCloseButton={isCapital}
        />
      )}
    </RenderLogger>
  );
}

function Label({ label, field }) {
  const derived = useSettingsStore((s) => s.derived);

  const [isVisible, setVisiblity] = useState();

  const derivedInput = derived.input;
  const adjust = derived.adjust;
  const isAmountLock = derivedInput === "amount";
  const isPAP = (f) => f === "pts" || f === "amount" || f === "percent";

  const getTitle = () => {
    return [
      "✏️ Input",
      field === derivedInput && "🎯 Derived Input",
      ((adjust === field && isAmountLock) ||
        field === derivedInput ||
        isPAP(field)) &&
        "🔄 Auto-Calculated",
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
        position={field.includes("Price") || field === "qty" ? "top" : "bottom"}
      />
    </div>
    // </RenderLogger>
  );
}
