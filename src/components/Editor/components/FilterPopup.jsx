import React from "react";

function FilterPopup({ toggleFilterPopup, applyAndClear, applyAndClose }) {
  return (
    <div className="editor-modal-overlay-filter">
      <div className="editor-modal-filter">
        <table style={{ width: "100%" }}>
          <tr>
            <td style={{ width: "95%" }}>
              <h3>Filter Options</h3>
            </td>
            <td style={{ textAlign: "right" }}>
              <button
                className="editor-close-button"
                onClick={toggleFilterPopup}
              >
                &times;
              </button>
            </td>
          </tr>
        </table>

        <div className="editor-filter-options">
          <div className="editor-filter-group">
            <label>Date Range:</label>
            <select className="editor-date-range-dropdown">
              <option value="">Select Range</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last15days">Last 15 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
            </select>
          </div>
          <div className="editor-filter-group-row">
            <div className="editor-filter-group">
              <label>Start Date:</label>
              <input type="date" />
            </div>
            <div className="editor-filter-group">
              <label>End Date:</label>
              <input type="date" />
            </div>
          </div>
          <div className="editor-filter-group">
            <label>Last Number of Trades:</label>
            <input type="number" placeholder="Enter number of trades" />
          </div>
        </div>
        <div className="editor-modal-filter-buttons">
          <button className="editor-clear-button" onClick={applyAndClear}>
            Clear
          </button>
          <button
            className="editor-filter-apply-button"
            onClick={applyAndClose}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterPopup;
