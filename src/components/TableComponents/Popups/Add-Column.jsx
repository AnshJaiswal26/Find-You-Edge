import React from "react";
import { useState } from "react";
import Button from "../../Button/Button";

const AddColumnModal = ({ onClose, onSave, dynamicColumns }) => {
  const [columnName, setColumnName] = useState("");
  const [inputType, setInputType] = useState("Text Input");
  const [options, setOptions] = useState([]);
  const [position, setPosition] = useState(dynamicColumns.length); // Default to the last position
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleChangeOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!columnName.trim()) {
      setErrorMessage("Column name is required.");
      return;
    }
    if (inputType === "Dropdown" && options.some((opt) => !opt.trim())) {
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
    };
    onSave(columnData, position);
    setErrorMessage(""); // Clear error message on successful save
  };

  return (
    <div className="add-column-modal-overlay">
      <div className="add-column-modal add-column-enhanced-modal ">
        <h3 className="add-column-modal-title">Add Column</h3>
        {errorMessage && (
          <p className="add-column-error-message">{errorMessage}</p>
        )}
        <div className="add-column-form-group">
          <label className="add-column-form-label">Column Name</label>
          <input
            type="text"
            className="add-column-form-input"
            placeholder="Enter column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </div>
        <div className="add-column-form-group">
          <label className="add-column-form-label">Input Type</label>
          <select
            className="add-column-form-select"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="Text Input">Text Input</option>
            <option value="Dropdown">Dropdown</option>
          </select>
        </div>
        {inputType === "Dropdown" && (
          <div className="add-column-form-group">
            <label className="add-column-form-label">Dropdown Options</label>
            {options.map((option, index) => (
              <div key={index} className="add-column-option-row">
                <input
                  type="text"
                  className="add-column-form-input add-column-option-input"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleChangeOption(index, e.target.value)}
                />
                <button
                  type="button"
                  className="add-column-remove-option-button"
                  onClick={() => handleRemoveOption(index)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-column-add-option-button"
              onClick={handleAddOption}
            >
              Add Option
            </button>
          </div>
        )}
        <div className="add-column-form-group">
          <label className="edge-form-label">Position</label>
          <input
            type="number"
            className="add-column-form-input"
            placeholder="Enter position (0-based index)"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            min="0"
            max={dynamicColumns.length}
          />
        </div>
        <div className="add-column-form-actions">
          <Button text="Save Column" onClick={handleSubmit} styleType="SAVE" />
          <Button text="Cancel" onClick={onClose} styleType="DELETE" />
        </div>
      </div>
    </div>
  );
};

export default AddColumnModal;
