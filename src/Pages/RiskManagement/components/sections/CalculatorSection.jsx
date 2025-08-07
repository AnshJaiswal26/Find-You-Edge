import { debounce } from "lodash";
import { Button, ValidationTooltip } from "@components";
import { Input } from "@RM/components";
import { useTransaction } from "@RM/context";
import { useClearLogic, useSectionData } from "@RM/hooks";
import { CalculatorGridBox } from "@RM/layout";
import { useEffect, useMemo, useRef } from "react";

export default function CalculatorSection({ section }) {
  const renderCount = useRef(-1);
  renderCount.current += 1;
  console.log("CalculatorSection", "Render count:", renderCount.current);

  const { name, buyPrice, sellPrice, qty, color } = section;

  const { transaction, updateTransaction } = useTransaction();
  const sectionName =
    name === "target"
      ? "Target"
      : name === "stopLoss"
      ? "Stop-Loss"
      : "Calculator";

  const debouncedsetHoveredSection = useMemo(() => {
    return debounce(() => {
      setHoveredSection();
    }, 100);
  }, [buyPrice, sellPrice, qty, sectionName]);

  const setHoveredSection = () => {
    if (transaction.currentSection.name === sectionName) return;

    updateTransaction({
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      qty: qty,
      currentSection: {
        name: sectionName,
        color: section.color,
      },
    });

    console.log(`setting ${name} to transaction`);
    console.log("buyPrice", buyPrice);
    console.log("sellPrice", sellPrice);
    console.log("qty", qty);
  };
  const isTargetOrSL = section.name !== "calculator";

  return (
    <div
      key={section.name}
      className="calculator-sections"
      onMouseEnter={() => debouncedsetHoveredSection()}
    >
      <div className="section-heading flex justify">
        <span className={color}>{sectionName}</span>
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
      <InputRow section={section} />
      {!isTargetOrSL && <FooterButtons section={section} />}
    </div>
  );
}

function InputRow({ section }) {
  const inputData = useSectionData(section);
  console.log("InputRow for section:", section.name, inputData);

  return (
    <CalculatorGridBox>
      {inputData.map((input) => (
        <div className="relative" key={input.field}>
          <Input
            className={input.className}
            label={input.label}
            section={section}
            field={input.field}
            value={section[input.field]}
          />
          {input.note.map((note, idx) => (
            <ValidationTooltip
              key={idx}
              type={note.type ?? "error"}
              message={note.message}
              position={note.position}
              isVisible={note.show}
              autoHide={false}
              showCloseButton={false}
            />
          ))}
        </div>
      ))}
    </CalculatorGridBox>
  );
}

function FooterButtons({ section }) {
  const { clearSection } = useClearLogic();

  return (
    <div className="footer-buttons">
      <Button
        text="Clear All"
        color="#fe5a5a"
        onClick={() => clearSection(section)}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
        }}
      />
    </div>
  );
}
