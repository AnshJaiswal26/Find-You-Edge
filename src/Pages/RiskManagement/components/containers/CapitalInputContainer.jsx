import { useNote, useSettings, useRiskCalculator } from "../../context/context";
import InputNote from "../../../../components/InputTooltip/InputNote";
import { useInputChange } from "../../hooks/useInputChange";
import { handleSpecialCases } from "../../utils/utils";

export function CapitalInputContainer() {
  console.log("CapitalInputContainer...");

  return (
    <div className="containers">
      <div className="flex justify wrap">
        <div className="flex baseline gap10 relative">
          <label className="risk-label fs20">Capital</label>
          <CapitalInput />
          <CapitalInputNote />
        </div>
        <SettingsButton />
      </div>
    </div>
  );
}

function CapitalInput() {
  const { capital } = useRiskCalculator();
  const { handleChange } = useInputChange();

  return (
    <input
      className="risk-input"
      type="text"
      value={capital.current}
      onChange={(e) => {
        handleChange(capital, "capital", e.target.value);
      }}
      onBlur={(e) => {
        handleSpecialCases(capital, "capital", e.target.value);
      }}
      placeholder="₹"
      min={0}
    />
  );
}

function CapitalInputNote() {
  const { note } = useNote();

  return (
    <InputNote
      message="Enter Capital to calculate returns in %"
      down={true}
      show={note.capital.current}
      style={{ bottom: "-50px" }}
    />
  );
}

function SettingsButton() {
  const { showSettings, updateSettings } = useSettings();

  console.log("showSettings", showSettings);

  return (
    <button
      className="settings-icon-btn"
      onClick={() => updateSettings("showSettings", true)}
    >
      <img
        style={{
          width: "20px",
          height: "20px",
          filter: "invert(1)",
        }}
        src="Icons/others/adjust.png"
        alt="Settings Icon"
      />
    </button>
  );
}
