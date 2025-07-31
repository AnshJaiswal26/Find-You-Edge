import React from "react";
import { Button } from "@components";
import "./Popup.css";

function EditDropdownColumn({
  editDropdownColumn,
  dropdownOptions,
  handleUpdateDropdownOption,
  handleRemoveDropdownOption,
  handleAddDropdownOption,
  handleSaveDropdownOptions,
  handleCancelEditDropdown,
}) {
  return (
    <div className="edit-dropdown-modal-overlay">
      <div className="edit-dropdown-modal edit-dropdown-enhanced-modal">
        <h3 className="edit-dropdown-modal-title">
          Edit Dropdown Options for {editDropdownColumn}
        </h3>
        <div className="edit-dropdown-dropdown-options">
          {dropdownOptions.map((option, index) => (
            <div key={index} className="edit-dropdown-dropdown-option-row">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleUpdateDropdownOption(index, e.target.value)
                }
                placeholder={`Option ${index + 1}`}
                className="edit-dropdown-dropdown-option-input"
              />
              <button
                className="edit-dropdown-remove-option-button"
                onClick={() => handleRemoveDropdownOption(index)}
              >
                &times;
              </button>
            </div>
          ))}
          <div>
            <Button
              text="Add Option"
              onClick={handleAddDropdownOption}
              styleType="SAVE"
            />
          </div>
        </div>
        <div className="edit-dropdown-modal-buttons">
          <Button
            text="Save"
            onClick={handleSaveDropdownOptions}
            styleType="SAVE"
          />
          <Button
            text="Cancel"
            onClick={handleCancelEditDropdown}
            styleType="DELETE"
          />
        </div>
      </div>
    </div>
  );
}

export default EditDropdownColumn;
