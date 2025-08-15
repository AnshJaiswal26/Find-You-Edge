import { useMemo } from "react";
import { debounce } from "lodash";
import { Button, ValidationTooltip } from "@components";
import { Input } from "@RM/components";
import {
  useCalculatorStore,
  useSettingsStore,
  useTooltipStore,
} from "@RM/context";
import { useClearLogic } from "@RM/hooks";
import { CalculatorGridBox } from "@RM/layout";
import { fieldLabels, fields, sectionColor, sectionLabels } from "@RM/data";
import RenderLogger from "@Profiler";

export default function CalculatorSection({ sectionName }) {
  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);

  const debouncedsetHoveredSection = useMemo(() => {
    const handler = debounce((name) => {
      const currentTransaction =
        useCalculatorStore.getState().currentTransaction;
      if (currentTransaction === name) return;
      updateSection("currentTransaction", name);
    }, 100);

    return handler;
  }, [updateSection]);

  const isTargetOrSL = sectionName !== "calculator";

  return (
    // <RenderLogger id={"CalculatorSection"} why={sectionName}>
    <div
      key={sectionName}
      className="calculator-sections"
      onMouseEnter={() => debouncedsetHoveredSection(sectionName)}
    >
      <div className="section-heading flex justify">
        <span className={sectionColor[sectionName]}>
          {sectionLabels[sectionName]}
        </span>
        {isTargetOrSL && (
          <Button
            text={`Place ${sectionName}`}
            color="#05ab72"
            style={{
              padding: "3px 10px",
              fontSize: "12px",
              disabled: true,
            }}
          />
        )}
      </div>
      <InputRow sectionName={sectionName} />
      {!isTargetOrSL && <FooterButtons sectionName={sectionName} />}
    </div>
    // </RenderLogger>
  );
}

function InputRow({ sectionName }) {
  return (
    // <RenderLogger id={"InputRow"} why={sectionName}>
    <CalculatorGridBox>
      {fields.map((field) => (
        <div className="relative" key={field}>
          <Input
            label={fieldLabels[field]}
            sectionName={sectionName}
            field={field}
          />
        </div>
      ))}
    </CalculatorGridBox>
    // </RenderLogger>
  );
}

function MapValidationTooltips({ sectionName, key, message, type, position }) {
  const isVisible = useTooltipStore((s) => s[sectionName]?.[key]);
  const derivedInput = useSettingsStore((s) => s.derived.input);
  const msg =
    message +
    (derivedInput === "amount"
      ? "adjust Pts or Amount or Pnl(%) to rebalance the calculation."
      : "");

  return (
    <>
      <ValidationTooltip
        type={type ?? "error"}
        message={msg}
        position={position}
        isVisible={isVisible}
        autoHide={false}
        showCloseButton={false}
      />
    </>
  );
}

function FooterButtons({ sectionName }) {
  const { clearSection } = useClearLogic();

  return (
    <div className="footer-buttons">
      <Button
        text="Clear All"
        color="#fe5a5a"
        onClick={() => clearSection(sectionName)}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
        }}
      />
    </div>
  );
}
