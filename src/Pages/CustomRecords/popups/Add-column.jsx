import { useState } from "react";
import Button from "../../../components/Button/Button";

const AddColumnModal = ({
  onClose,
  onSave,
  dynamicColumns,
  color,
  bgcColor,
  setBgcTransparent,
  bgcTransparent,
}) => {
  const [columnName, setColumnName] = useState("");
  const [inputType, setInputType] = useState("Text Input");
  const [options, setOptions] = useState([]);
  const [position, setPosition] = useState(dynamicColumns.length);
  const [errorMessage, setErrorMessage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(bgcColor);
  const [textColor, setTextColor] = useState(color);

  const handleAddOption = () => {
    setOptions([
      ...options,
      { value: "", backgroundColor: bgcColor, textColor: color },
    ]);
  };

  const handleChangeOption = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    setOptions(updatedOptions);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!columnName.trim()) {
      setErrorMessage("Column name is required.");
      return;
    }
    if (inputType === "Dropdown" && options.some((opt) => !opt.value.trim())) {
      setErrorMessage("All dropdown options must be filled.");
      return;
    }
    if (inputType === "Dropdown" && options.length === 0) {
      setErrorMessage("At least one dropdown option is required.");
      return;
    }

    const columnData = {
      name: columnName,
      type: inputType,
      options: inputType === "Dropdown" ? options : [],
      backgroundColor: inputType !== "Dropdown" ? backgroundColor : undefined,
      textColor: inputType !== "Dropdown" ? textColor : undefined,
    };

    if (
      dynamicColumns.some(
        (col) => col.name.toLowerCase() === columnData.name.toLowerCase()
      )
    ) {
      setErrorMessage("Column already exists");
      return;
    }

    onSave(columnData, position);
    setErrorMessage("");
  };

  return (
    <div
      className={bgcTransparent ? "modal-overlay transparent" : "modal-overlay"}
    >
      <div className="modal">
        <h3 className="modal-title">Add Column</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label className="form-label">Column Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Input Type</label>
          <select
            className="form-select"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="Text Input">Text Input</option>
            <option value="Dropdown">Dropdown</option>
            <option value="Date">Date</option>
            <option value="Time">Time</option>
          </select>
        </div>
        {inputType === "Dropdown" && (
          <div className="form-group">
            <label className="form-label">Dropdown Options</label>
            {options.map((option, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  className="form-input option-input"
                  placeholder={`Option ${index + 1}`}
                  value={option.value}
                  onChange={(e) =>
                    handleChangeOption(index, "value", e.target.value)
                  }
                />
                <div className="option-colors">
                  <label>B</label>
                  <input
                    type="color"
                    value={option.backgroundColor || bgcColor}
                    onChange={(e) =>
                      handleChangeOption(
                        index,
                        "backgroundColor",
                        e.target.value
                      )
                    }
                    onFocus={() => setBgcTransparent(true)}
                    onBlur={() => setBgcTransparent(false)}
                  />
                  <label>T</label>
                  <input
                    type="color"
                    value={option.textColor || color}
                    onChange={(e) =>
                      handleChangeOption(index, "textColor", e.target.value)
                    }
                    onFocus={() => setBgcTransparent(true)}
                    onBlur={() => setBgcTransparent(false)}
                  />
                </div>
                <button
                  type="button"
                  className="remove-option-button"
                  onClick={() => handleRemoveOption(index)}
                >
                  &times;
                </button>
              </div>
            ))}
            <Button
              text={"Add Option"}
              styleType={"SAVE"}
              onClick={handleAddOption}
            />
          </div>
        )}
        {inputType !== "Dropdown" && (
          <div className="form-group">
            <label className="form-label">Colors</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="color-picker">
                <label>Background Colors</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  onFocus={() => setBgcTransparent(true)}
                  onBlur={() => setBgcTransparent(false)}
                />
              </div>
              <div className="color-picker">
                <label>Text Colors</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  onFocus={() => setBgcTransparent(true)}
                  onBlur={() => setBgcTransparent(false)}
                />
              </div>
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Position</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter position (0-based index)"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            min="0"
            max={dynamicColumns.length}
          />
        </div>
        <div className="form-actions">
          <Button
            text="Save Column"
            styleType={"SAVE"}
            onClick={handleSubmit}
          />

          <Button text="Cancel" styleType={"DELETE"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AddColumnModal;
