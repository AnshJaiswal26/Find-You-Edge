import React, { useRef, useState } from "react";
import InputNote from "../../../components/InputTooltip/InputNote";
import Button from "../../../components/Button/Button";
import { handleSpecialCases } from "./function";
import { debounce } from "lodash";

export const clearAll = (section, isClearedRef, showNote, update) => {
  if (isClearedRef.current[section.name]) return;

  const field = section.name === "target" ? "greater" : "less";

  if (section.name !== "calculator") {
    update("other", {
      rr: 0,
    });

    update("showNote", {
      [section.name]: {
        ...showNote[section.name],
        [field]: false,
      },
    });
  }

  update(section.name, 0);

  update("transaction", 0);

  isClearedRef.current[section.name] = setTimeout(() => {
    delete isClearedRef.current[section.name];
  }, 1000);
};

function CalculationsSection({
  section,
  showNote,
  currentSection,
  handleChange,
  update,
  isCleared,
}) {
  const sectionName =
    section.name === "target"
      ? "Target"
      : section.name === "stopLoss"
      ? "Stop-Loss"
      : "Calculator";

  const debouncedSetSection = debounce(() => {
    setSection();
  }, 150);

  const setSection = () => {
    if (currentSection.name === sectionName) return;

    update("section", {
      name: sectionName,
      color: section.color,
    });

    update("transaction", {
      buyPrice: section.buyPrice,
      sellPrice: section.sellPrice,
      qty: section.qty,
    });

    console.log("setSectionRun", section.name);
    console.log("buyPrice", section.buyPrice);
    console.log("sellPrice", section.sellPrice);
    console.log("qty", section.qty);

    return section.name;
  };

  const sections = [
    {
      label: "Buy Price",
      field: "buyPrice",
      placeholder: "Enter Buy Price",
      style: {
        color: "#05ab72",
        border: `${
          showNote[section.name]?.["greater"] ? "1px solid #fe5a5a" : ""
        }`,
      },
      type: "text",
      note: [
        {
          message:
            "Buy Price should be less than the Sell Price to Place Target",
          down: false,
          show: showNote[section.name]?.["greater"],
          style: { bottom: "43px" },
        },
      ],
    },
    {
      label: "Sell Price",
      field: "sellPrice",
      placeholder: "Enter Sell Price",
      style: {
        color: "#fe5a5a",
        border: `${
          showNote[section.name]?.["less"] ? "1px solid #fe5a5a" : ""
        }`,
      },
      type: "text",
      note: [
        {
          message:
            "Sell Price should be less than the Buy Price to Place Stop Loss",
          down: false,
          show: showNote[section.name]?.["less"],
          style: { bottom: "43px" },
        },
      ],
    },
    {
      label: "Qty",
      field: "qty",
      placeholder: "Enter Quantity",
      style: { color: "inherit" },
      type: "text",
      note: [],
    },
    {
      label: section.labels[0],
      field: "pts",
      placeholder: "Pts",
      style: {},
      type: "text",
      note: [],
    },
    {
      label: section.labels[1],
      field: "amount",
      placeholder: "₹",
      style: {},
      type: "text",
      note: [],
    },
    {
      label: section.labels[2],
      field: "percent",
      placeholder: "%",
      style: {},
      type: "text",
      note: [],
    },
  ];

  const isTargetOrSL = section.name === "target" || section.name === "stopLoss";
  const color =
    section.name === "calculator"
      ? section.amount < 0 || section.pts < 0
        ? "red"
        : section.amount > 0 || section.pts > 0
        ? "green"
        : section.color
      : section.color;

  return (
    <div
      className="calculator-sections"
      style={{
        "--grid-width": !isTargetOrSL ? "160px" : "80px",
      }}
      onMouseEnter={() => debouncedSetSection()}
    >
      <div className="section-heading">
        <span className={"element " + section.color}>{sectionName}</span>
      </div>
      <div className="risk-input-row">
        {sections.map((input) => (
          <div className="risk-input-group" key={input.field}>
            <label className="risk-label">{input.label}</label>
            <input
              className={`risk-input ${color}`}
              style={input.style}
              type={input.type}
              value={section[input.field]}
              placeholder={input.placeholder}
              onChange={(e) => {
                handleChange(section, input.field, e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value === 0) return;
                handleSpecialCases(
                  section,
                  input.field,
                  e.target.value,
                  true,
                  update
                );
              }}
              min={0}
            />
            {input.note.map((note, idx) => (
              <InputNote
                key={idx}
                message={note.message}
                down={note.down}
                show={note.show}
                style={note.style}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="footer-buttons">
        {!isTargetOrSL && (
          <Button
            text="Clear All"
            color="#fe5a5a"
            onClick={clearAll(section, isCleared, showNote, update)}
            style={{
              padding: "3px 10px",
              fontSize: "12px",
            }}
          />
        )}
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
    </div>
  );
}

export default CalculationsSection;
