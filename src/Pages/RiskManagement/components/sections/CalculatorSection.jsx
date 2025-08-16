import { useMemo } from "react";
import { debounce } from "lodash";
import { Button } from "@components";
import { Input } from "@RM/components";
import { useRiskManagementStore } from "@RM/stores";
import { useClearLogic } from "@RM/hooks";
import { CalculatorGridBox } from "@RM/layout";
import { fieldLabels, fields, sectionColor, sectionLabels } from "@RM/data";
import RenderLogger from "@Profiler";

export default function CalculatorSection({ sectionName }) {
  const updateSection = useRiskManagementStore((s) => s.update.section);

  const debouncedsetHoveredSection = useMemo(() => {
    const handler = debounce((name) => {
      const currentTransaction =
        useRiskManagementStore.getState().currentTransaction;
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
