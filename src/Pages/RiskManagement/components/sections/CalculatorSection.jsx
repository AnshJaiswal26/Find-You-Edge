import { useMemo } from "react";
import { debounce } from "lodash";
import { Button } from "@components";
import { Input } from "@RM/components";
import { useRiskManagementStore } from "@RM/stores";
import { useClearLogic } from "@RM/hooks";
import { CalcualtorSectionLayout } from "@RM/layout";
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
    <CalcualtorSectionLayout
      name={sectionName}
      onMouseEnter={debouncedsetHoveredSection}
      headerElement={
        isTargetOrSL && (
          <Button
            text={`Place ${sectionName}`}
            color="#05ab72"
            style={{
              padding: "3px 10px",
              fontSize: "12px",
              disabled: true,
            }}
          />
        )
      }
      inputGrid={fields.map((field) => (
        <div className="relative" key={field}>
          <Input
            label={fieldLabels[field]}
            sectionName={sectionName}
            field={field}
          />
        </div>
      ))}
    >
      {!isTargetOrSL && <FooterButtons sectionName={sectionName} />}
    </CalcualtorSectionLayout>
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
