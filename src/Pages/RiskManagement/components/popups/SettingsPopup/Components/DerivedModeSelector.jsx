import { ButtonSelector, Overview } from "@components";
import { fieldLabels } from "../../../../data/fieldData";

export default function DerivedModeSelector({
  derivedField,
  changesViaAmount,
  updateSettings,
}) {
  const label = fieldLabels[derivedField];

  const explanationPoints = {
    amount: [
      `${label} is automatically calculated using Buy Price, Sell Price, and Quantity.`,
      `✅ Use this when you want to unlink prices and compute potential profit.`,
      `🔁 Changes in Buy/Sell Price or Quantity will update ${label}.`,
    ],
    buyPrice: [
      `${label} is derived from Amount, Sell Price, and Quantity.`,
      `✅ Useful when targeting a specific profit and computing required Buy Price.`,
      `🔁 Altering Amount or Sell Price will adjust ${label}.`,
    ],
    sellPrice: [
      `${label} is derived from Buy Price, Amount, and Quantity.`,
      `✅ Use this when you've locked in Buy Price and want to compute ideal Sell Price.`,
      `🔁 Modifying Buy Price or Amount recalculates ${label}.`,
    ],
  };

  return (
    <div className="settings-popup-section">
      <div>
        <ButtonSelector
          label={"Derived Input:"}
          options={["amount", "buyPrice", "sellPrice"]}
          selectedOption={derivedField}
          onSelect={(mode) => updateSettings({ derived: { mode: mode } })}
          fieldFormatter={fieldLabels}
        />
      </div>
      {derivedField === "amount" && (
        <div className="settings-popup-label flex center gap10">
          <span className="margin-bottom-10">When Amount changes adjust:</span>
          <ButtonSelector
            options={["buyPrice", "sellPrice"]}
            selectedOption={changesViaAmount}
            onSelect={(mode) => updateSettings({ amount: { changesIn: mode } })}
            size="small"
            fieldFormatter={fieldLabels}
          />
        </div>
      )}
      <Overview
        title={"📘 Derived Input Overview"}
        pointsArray={explanationPoints[derivedField]}
      />
    </div>
  );
}
