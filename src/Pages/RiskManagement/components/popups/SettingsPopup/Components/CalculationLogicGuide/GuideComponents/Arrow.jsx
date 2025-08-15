import { useTab } from "../../../../../../context/TabContext";
import { fieldLabels } from "../../../../../../data/fieldData";

export default function Arrow({ selectedField }) {
  
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
