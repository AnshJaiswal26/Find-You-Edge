import InputNote from "../../../../components/InputTooltip/InputNote";
import Button from "../../../../components/Button/Button";
import { debounce } from "lodash";
import { useTransaction, useNote } from "../../context/context";
import { useClearLogic, useInputChange } from "../../hooks/hooks";
import { handleSpecialCases } from "../../utils/utils";

export default function CalculatorSection({ section, update }) {
  console.log("CalculatorSection...");
  const { name, buyPrice, sellPrice, qty, color } = section;

  const { transaction, updateTransaction } = useTransaction();
  const sectionName =
    name === "target"
      ? "Target"
      : name === "stopLoss"
      ? "Stop-Loss"
      : "Calculator";

  const debouncedsetHoveredSection = debounce(() => {
    setHoveredSection();
  }, 100);

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

  const isTargetOrSL = name !== "calculator";

  return (
    <div
      className="calculator-sections"
      style={{
        "--grid-width": !isTargetOrSL ? "150px" : "100px",
      }}
      onMouseEnter={() => debouncedsetHoveredSection()}
    >
      <div className="section-heading">
        <span className={"element " + color}>{sectionName}</span>
      </div>

      <InputRow section={section} update={update} />
      <FooterButtons
        section={section}
        update={update}
        sectionName={sectionName}
      />
    </div>
  );
}

function InputRow({ section, update }) {
  const { note } = useNote();
  const { name, pts, amount, labels } = section;
  const { handleChange } = useInputChange();

  const color =
    name === "calculator"
      ? amount < 0 || pts < 0
        ? "red"
        : amount > 0 || pts > 0
        ? "green"
        : section.color
      : section.color;

  const sections = [
    {
      label: "Buy Price",
      field: "buyPrice",
      placeholder: "Enter Buy Price",
      style: {
        color: "#05ab72",
        border: `${note[name]?.greater ? "1px solid #fe5a5a" : ""}`,
      },
      type: "text",
      note: [
        {
          message:
            "Buy Price should be less than the Sell Price to Place Target",
          down: false,
          show: note[name]?.greater,
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
        border: `${note[name]?.less ? "1px solid #fe5a5a" : ""}`,
      },
      type: "text",
      note: [
        {
          message:
            "Sell Price should be less than the Buy Price to Place Stop Loss",
          down: false,
          show: note[name]?.less,
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
      label: labels[0],
      field: "pts",
      placeholder: "Pts",
      style: {},
      type: "text",
      note: [],
    },
    {
      label: labels[1],
      field: "amount",
      placeholder: "₹",
      style: {},
      type: "text",
      note: [],
    },
    {
      label: labels[2],
      field: "percent",
      placeholder: "%",
      style: {},
      type: "text",
      note: [],
    },
  ];

  return (
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
  );
}

function FooterButtons({ section, update, sectionName }) {
  const { clearSection } = useClearLogic();
  const isTargetOrSL = section.name !== "calculator";

  return (
    <div className="footer-buttons">
      {!isTargetOrSL && (
        <Button
          text="Clear All"
          color="#fe5a5a"
          onClick={() => clearSection(section, update)}
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
  );
}
