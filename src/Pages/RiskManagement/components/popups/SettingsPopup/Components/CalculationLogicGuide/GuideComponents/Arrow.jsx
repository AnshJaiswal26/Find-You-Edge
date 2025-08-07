import { useTab } from "../../../../../../context/TabContext";
import { fieldLabels } from "../../../../../../data/fieldData";

export default function Arrow({ settings, updateSettings, selectedField }) {
  const { currentTab } = useTab();
  const isRR = currentTab === "risk-management";
  return (
    <>
      <div className="arrow-icon-wrapper">
        <span className="arrow-icon">↓</span>
        <span className="input-title">
          When you Change in ({fieldLabels[selectedField]})
        </span>
      </div>
    </>
  );
}
