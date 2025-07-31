import { useTab } from "../../../../../../context/TabContext";
import { fieldLabels } from "../../../data/fieldData";

export default function ManualInputs({ userDefined }) {
  const { currentTab } = useTab();
  const isRR = currentTab === "risk-management";

  return (
    <div>
      <div className="section-title input-title">
        🔢 Manual Inputs ({userDefined.length})
      </div>
      <div className="flex column gap10">
        {userDefined.map((field) => (
          <div className="field-card input-card">
            <div className="field-name">{fieldLabels[field]}</div>
            <div className="formula-box-green">
              <div className="formula-value-green">Manual / Last Change</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
