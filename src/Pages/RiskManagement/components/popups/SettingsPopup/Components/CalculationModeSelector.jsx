import { ToggleButton, ButtonSelector, Overview } from "@components";
import { useRiskManagementStore } from "@RM/stores";
import { calculationPoints } from "@RM/data";

export default function CalculationModeSelector({ updateSettings }) {
  const autoRound = useRiskManagementStore(
    (s) => s.settings.calculation.autoRound
  );

  return (
    <>
      <div className="settings-popup-label-container">
        <div className="settings-popup-label">Calculation Mode:</div>
        <ToggleButton
          label={["Auto-Rounding"]}
          toggleOn={autoRound}
          onClick={() =>
            updateSettings("calculation", { autoRound: !autoRound })
          }
          color={"#1d4ed8"}
        />
      </div>
      <SelectorAndOverview updateSettings={updateSettings} />
    </>
  );
}

function SelectorAndOverview({ updateSettings }) {
  const calcMode = useRiskManagementStore((s) => s.settings.calculation.mode);

  return (
    <>
      <ButtonSelector
        options={["Approx", "Market", "Buffer"]}
        selectedOption={calcMode}
        onSelect={(mode) => updateSettings("calculation", { mode: mode })}
      />
      <Overview
        title={"⚙️ Calculation Mode Overview"}
        pointsArray={calculationPoints[calcMode]}
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
