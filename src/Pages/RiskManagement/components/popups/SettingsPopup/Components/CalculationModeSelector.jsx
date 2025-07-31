import { ToggleButton, ButtonSelector, Overview } from "@components";

export default function CalculationModeSelector({
  calculationMode,
  updateSettings,
  autoRounding,
}) {
  const points = {
    Approx: [
      "Rounding is done up to 2 decimal places.",
      "✅ Useful for quick estimates and faster input.",
      "⚠️ May result in minor precision loss — not ideal for order placement.",
    ],
    Precise: [
      "Calculations go up to 5 decimal places.",
      "✅ Ideal when precision is critical for analysis or strategy testing.",
      "⚠️ May not align perfectly with market constraints (order multipliers).",
    ],
    Market: [
      "Values align with market multiples — typically steps of 0.05.",
      "✅ Best used when placing target or stop-loss orders.",
    ],
    Buffer: [
      "Rounding happens in steps of 0.1 for safer execution.",
      "✅ Use when placing risk-sensitive orders to avoid slippage.",
      "👍 Recommended for stop-loss and target setup to ensure reliability.",
    ],
  };
  return (
    <>
      <div className="settings-popup-label-container">
        <div className="settings-popup-label">Calculation Mode:</div>
        <ToggleButton
          label={["Auto-Rounding"]}
          toggleOn={autoRounding}
          onClick={() => updateSettings({ autoRounding: !autoRounding })}
          color={"#1d4ed8"}
        />
      </div>
      <ButtonSelector
        options={["Approx", "Precise", "Market", "Buffer"]}
        selectedOption={calculationMode}
        onSelect={(mode) => updateSettings({ calculation: { mode: mode } })}
      />
      <Overview
        title={"⚙️ Calculation Mode Overview"}
        pointsArray={points[calculationMode]}
        withNote={true}
        note={
          <>
            📌 <strong>Note:</strong> For placing target or stop-loss orders,
            it's recommended to keep the <strong>Calculation Mode</strong> set
            to <em>Buffer</em> or <em>Market</em> to ensure compatibility with
            tick-size and exchange constraints.
          </>
        }
      />
    </>
  );
}
