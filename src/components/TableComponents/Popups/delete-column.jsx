import React from "react";
import "./Popup.css";
import { Button } from "@components";

function DeleteColumnModal({
  selectedColumn,
  setSelectedColumn,
  dynamicColumns,
  handleDeleteDynamicColumn,
  setShowDeleteColumnModal,
}) {
  return (
    <div className="delete-column-modal-overlay">
      <div className="delete-column-modal">
        <h3>Delete Dynamic Column</h3>
        <div className="delete-column-form-group">
          <label>Select Column</label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="" disabled>
              Select Column
            </option>
            {dynamicColumns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
        <div className="delete-column-form-actions">
          <button
            onClick={handleDeleteDynamicColumn}
            className="delete-column-delete-button"
            disabled={!selectedColumn}
          >
            Delete
          </button>
          <Button
            text="Cancel"
            onClick={() => setShowDeleteColumnModal(false)}
            styleType="DELETE"
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteColumnModal;
