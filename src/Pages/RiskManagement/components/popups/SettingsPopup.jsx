import { useSettings } from "../../context/SettingsContext";

export default function Settings() {
  console.log("Settings...");

  const { showSettings, calcMode, calcModeSAndT, updateSettings } =
    useSettings();

  return showSettings ? (
    <div className="settings-popup-overlay">
      <div className="settings-popup">
        <div className="settings-popup-header">
          <h3>Settings</h3>
          <button
            className="close-popup"
            onClick={() => updateSettings("showSettings", false)}
          >
            &times;
          </button>
        </div>
        <div className="settings-content">
          <CalculatorAccuracySelector
            value={calcMode}
            onChange={(e) => updateSettings("calcMode", e.target.value)}
            label="Normal Calculator: "
            options={[
              "Approx",
              "Precise",
              "Buffer (Good for Silpage)",
              "Market (Recommended)",
            ]}
          />
          <CalculatorAccuracySelector
            value={calcModeSAndT}
            onChange={(e) => updateSettings("calcModeSAndT", e.target.value)}
            label="Risk/Reward Calculator: "
            options={["Buffer (Good for Silpage)", "Market (Recommended)"]}
          />
        </div>
      </div>
    </div>
  ) : null;
}

function CalculatorAccuracySelector({ value, onChange, label, options }) {
  return (
    <div className="risk-calc-mode">
      <h3>Calculators Accuracy</h3>
      <div className="risk-calc-mode-row">
        <span className="risk-label-settings">{label}</span>
        <select value={value} onChange={onChange}>
          {options.map((option, idx) => (
            <option key={idx} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
