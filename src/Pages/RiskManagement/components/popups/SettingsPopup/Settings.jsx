import "./settings.css";
import { useSettingsStore } from "@RM/context";
import {
  CalculationLogicGuide,
  CalculationModeSelector,
  DerivedModeSelector,
} from "./components";

function Settings() {
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const show = useSettingsStore((s) => s.show);

  if (!show) return null;

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup-container">
        {/* Header */}
        <div className="settings-popup-header">
          <div className="settings-popup-header-content">
            <span className="settings-popup-title">Settings</span>
            <button
              onClick={() => updateSettings("show", false)}
              className="settings-popup-close-button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="settings-popup-body">
          <CalculationModeSelector updateSettings={updateSettings} />

          <div className="divider"></div>

          <DerivedModeSelector updateSettings={updateSettings} />

          <div className="divider"></div>

          <CalculationLogicGuide updateSettings={updateSettings} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
