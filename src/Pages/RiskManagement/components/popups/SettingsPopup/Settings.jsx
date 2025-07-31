import "./settings.css";
import { useSettings } from "@RM/context";
import {
  CalculationLogicGuide,
  CalculationModeSelector,
  DerivedModeSelector,
} from "./components";

function Settings() {
  const { settings, updateSettings } = useSettings();
  const derivedField = settings.derived.mode;
  const calculationMode = settings.calculation.mode;
  const changesViaAmount = settings.amount.changesIn;

  if (!settings.show || !settings.calculation || !settings.derived) return null;

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup-container">
        {/* Header */}
        <div className="settings-popup-header">
          <div className="settings-popup-header-content">
            <span className="settings-popup-title">Settings</span>
            <button
              onClick={() => updateSettings({ show: false })}
              className="settings-popup-close-button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="settings-popup-body">
          <CalculationModeSelector
            calculationMode={calculationMode}
            updateSettings={updateSettings}
            autoRounding={settings.autoRounding}
          />

          <div className="divider"></div>

          <DerivedModeSelector
            derivedField={derivedField}
            changesViaAmount={changesViaAmount}
            updateSettings={updateSettings}
          />

          <div className="divider"></div>

          <CalculationLogicGuide
            settings={settings}
            updateSettings={updateSettings}
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;
