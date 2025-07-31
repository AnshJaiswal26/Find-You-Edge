import { fieldLabels } from "../../../data/fieldData";

export default function InputFields({
  selectedField,
  updateSettings,
  mainFields,
}) {
  return (
    <div>
      <div className="section-title input-title">
        <span> ✏️ Input Fields ({mainFields.length})</span>
      </div>
      <div></div>
      <div className="field-grid">
        {mainFields.map((field) => (
          <div
            key={field}
            className={`field-card input-card input-field ${
              field === selectedField ? "selected" : ""
            }`}
            onClick={() => updateSettings({ guide: { selectedField: field } })}
          >
            <div className="field-name">{fieldLabels[field]}</div>
            <div className="field-note">Editable</div>
          </div>
        ))}
      </div>
    </div>
  );
}
