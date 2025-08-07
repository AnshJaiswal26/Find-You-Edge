import { useState } from "react";
import "./Inputs.css";
import { useCalculator, useRiskCalculator, useSettings } from "@RM/context";
import { useInputChange, useSpecialCaseHandler } from "@RM/hooks";
import { Tooltip } from "@components";

export default function Input({ className, label, section, field, value }) {
  const handleChange = useInputChange();
  const handleSpecialCases = useSpecialCaseHandler();
  const { calculatorFlash } = useCalculator();
  const { targetFlash, stopLossFlash } = useRiskCalculator();

  const { name, amount, pts } = section;

  const flashing =
    name === "calculator"
      ? calculatorFlash
      : name === "target"
      ? targetFlash
      : stopLossFlash;

  const isValidField =
    field === "pts" || field === "amount" || field === "percent";

  const color =
    isValidField &&
    (amount < 0 || pts < 0
      ? "red"
      : amount > 0 || pts > 0
      ? "green"
      : "neutral");

  return (
    <>
      <Label label={label} field={field} />
      <input
        className={`risk-input ${field} ${className} input-${color} ${
          flashing[field] ? "flashing" : ""
        }`}
        type="text"
        value={value}
        onChange={(e) => {
          handleChange(section, field, e.target.value);
        }}
        onBlur={(e) => {
          handleSpecialCases(section, field, e.target.value, true);
        }}
      />
    </>
  );
}

function Label({ label, field }) {
  const { settings } = useSettings();
  const [isVisible, setVisiblity] = useState();

  const mode = settings.derived.mode;
  const amtChangeIn = settings.amount.changesIn;
  const isAmountLock = mode === "amount";

  const getTitle = () => {
    return [
      "✏️ Input",
      field === mode && "🎯 Derived Input",
      ((amtChangeIn === field && isAmountLock) ||
        field === mode ||
        field === "pts" ||
        field === "amount" ||
        field === "percent") &&
        "🔄 Auto-Calculated",
    ];
  };

  return (
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
  );
}
