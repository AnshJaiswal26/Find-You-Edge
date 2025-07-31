import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Import the xlsx library
import "./CustomRecords.css";
import AddColumnModal from "./popups/Add-column";
import Filter from "../../components/TableComponents/Popups/Filter";
import DeleteColumnModal from "../../components/TableComponents/Popups/delete-column";
import DeleteConfirmationPopup from "../../components/TableComponents/Popups/Delete-Confirmation-Popup";
import Sidebar from "../../components/Sidebar/Sidebar";
import Editor from "../../components/Editor/Editor";
import { Button } from "@components";

function Backtest() {
  const [trades, setTrades] = useState([]); // Start with empty trades array
  const [tempColumnPosition, setTempColumnPosition] = useState(null);
  const [bgcTransparent, setBgcTransparent] = useState(false);

  const [filters, setFilters] = useState({
    field: "",
    value: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    profitMin: "",
    profitMax: "",
    lossMin: "",
    lossMax: "",
  });
  const [deleteIndex, setDeleteIndex] = useState(null); // Track the index of the record to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Track modal visibility
  const [showFilterModal, setShowFilterModal] = useState(false); // Track filter modal visibility
  const [dynamicColumns, setDynamicColumns] = useState([]); // Store dynamic columns
  const [showAddColumnModal, setShowAddColumnModal] = useState(false); // Modal visibility
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false); // Track delete column modal visibility
  const [selectedColumn, setSelectedColumn] = useState(""); // Track the selected column to delete
  const [editDropdownColumn, setEditDropdownColumn] = useState(null); // Track the column being edited
  const [dropdownOptions, setDropdownOptions] = useState([]); // Track options for the dropdown being edited
  const [editColumnSettings, setEditColumnSettings] = useState(null); // Add this state

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const textColor = theme === "dark" ? "#ffffff" : "#000000";
  const backgroundColor = theme === "dark" ? "#1c252e" : "#ffffff";

  theme === "dark"
    ? document.documentElement.classList.add("dark-theme")
    : document.documentElement.classList.remove("dark-theme");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAdd = () => {
    setTrades([
      ...trades,
      {
        ...dynamicColumns.reduce((acc, col) => {
          if (col.type === "Dropdown") {
            acc[col.name] = col.options[0]?.value || ""; // Default to the first dropdown option or an empty string
          } else if (col.type === "Text Input") {
            acc[col.name] = ""; // Default to an empty string for text inputs
          } else if (col.type === "Date") {
            acc[col.name] = ""; // Default to an empty string for date inputs
          } else if (col.type === "Time") {
            acc[col.name] = ""; // Default to an empty string for time inputs
          } else {
            acc[col.name] = ""; // Default to an empty string for any other type
          }
          return acc;
        }, {}),
      },
    ]);
  };

  const handleExport = () => {
    // Convert trades data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(trades);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");

    // Write the workbook and trigger a download
    XLSX.writeFile(workbook, "trades.xlsx");
  };

  const handleDelete = (index) => {
    setDeleteIndex(index); // Set the index of the record to delete
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  const confirmDelete = () => {
    setTrades(trades.filter((_, i) => i !== deleteIndex)); // Delete the record
    setShowDeleteModal(false); // Hide the modal
    setDeleteIndex(null); // Reset the index
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Hide the modal
    setDeleteIndex(null); // Reset the index
  };

  const handleChange = (index, field, value) => {
    const updatedTrades = [...trades];
    updatedTrades[index][field] = value;
    setTrades(updatedTrades);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      field: "",
      value: "",
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
      profitMin: "",
      profitMax: "",
      lossMin: "",
      lossMax: "",
    });
  };

  // Filter trades based on the filters
  const filteredTrades = trades.filter((trade) => {
    const fieldMatch = (() => {
      if (!filters.field || !filters.value) return true; // No field filter applied
      const fieldValue = trade[filters.field]?.toString().toLowerCase() || "";
      const filterValue = filters.value.toLowerCase();
      return fieldValue.includes(filterValue); // Check if the field value includes the filter value
    })();

    const timeMatch = (() => {
      if (!filters.startTime && !filters.endTime) return true; // No time filter applied
      const entryTime = trade.entryTime
        ? new Date(`1970-01-01T${trade.entryTime}`)
        : null;
      const startTime = filters.startTime
        ? new Date(`1970-01-01T${filters.startTime}`)
        : null;
      const endTime = filters.endTime
        ? new Date(`1970-01-01T${filters.endTime}`)
        : null;

      return (
        (!startTime || (entryTime && entryTime >= startTime)) &&
        (!endTime || (entryTime && entryTime <= endTime))
      );
    })();

    const dateMatch = (() => {
      if (!filters.startDate && !filters.endDate) return true; // No date filter applied
      const tradeDate = trade.date ? new Date(trade.date) : null;
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!startDate || (tradeDate && tradeDate >= startDate)) &&
        (!endDate || (tradeDate && tradeDate <= endDate))
      );
    })();

    return fieldMatch && timeMatch && dateMatch;
  });

  const handleAddColumn = (columnData, position) => {
    // Only check against dynamic columns

    const columnWithColors = {
      ...columnData,
      backgroundColor: columnData.backgroundColor || backgroundColor,
      textColor: columnData.textColor || textColor,
    };

    const updatedDynamicColumns = [...dynamicColumns];
    updatedDynamicColumns.splice(position, 0, columnWithColors);

    // Update trades to include the new column with default values and colors
    const updatedTrades = filteredTrades.map((trade) => ({
      ...trade,
      [columnData.name]:
        columnData.type === "Dropdown"
          ? columnData.options[0]?.value || ""
          : "", // Default value for non-dropdown columns
    }));

    setDynamicColumns(updatedDynamicColumns);
    setTrades(updatedTrades);
    setShowAddColumnModal(false);
  };

  const handleDeleteDynamicColumn = () => {
    if (selectedColumn) {
      setDynamicColumns(
        dynamicColumns.filter((col) => col.name !== selectedColumn)
      ); // Remove the column from dynamicColumns
      setTrades(
        filteredTrades.map((trade) => {
          const updatedTrade = { ...trade };
          delete updatedTrade[selectedColumn]; // Remove the column data from each trade
          return updatedTrade;
        })
      );
      setSelectedColumn(""); // Reset selected column
      setShowDeleteColumnModal(false); // Close modal
    }
  };

  const handleAddDropdownOption = () => {
    setDropdownOptions((prevOptions) => [
      ...prevOptions,
      {
        value: "",
        backgroundColor: backgroundColor,
        textColor: textColor,
      },
    ]);
  };

  const handleRemoveDropdownOption = (index) => {
    setDropdownOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    ); // Remove the option
  };

  const handleSaveDropdownOptions = () => {
    if (editDropdownColumn) {
      setDynamicColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.name === editDropdownColumn
            ? { ...col, options: dropdownOptions }
            : col
        )
      );

      // Update trades that use this dropdown
      setTrades((prevTrades) =>
        prevTrades.map((trade) => ({
          ...trade,
          [editDropdownColumn]: dropdownOptions[0]?.value || "",
        }))
      );

      setEditDropdownColumn(null);
      setDropdownOptions([]);
    }
  };

  const handleCancelEditDropdown = () => {
    setEditDropdownColumn(null); // Close the popup without saving
  };

  const handleEditColumnSettings = (columnName) => {
    const column = dynamicColumns.find((col) => col.name === columnName);
    if (column.type === "Dropdown") {
      setEditDropdownColumn(columnName);
      setDropdownOptions(column.options || []);
    } else {
      setEditColumnSettings(column);
      setTempColumnPosition(
        dynamicColumns.findIndex((col) => col.name === columnName)
      );
    }
  };

  const handleSaveColumnSettings = () => {
    if (editColumnSettings) {
      const updatedColumns = [...dynamicColumns];
      const columnIndex = updatedColumns.findIndex(
        (col) => col.name === editColumnSettings.name
      );

      if (columnIndex !== -1) {
        // Remove the column from its current position
        const [movedColumn] = updatedColumns.splice(columnIndex, 1);
        // Insert it at the new position
        updatedColumns.splice(tempColumnPosition, 0, {
          ...movedColumn,
          ...editColumnSettings,
        });

        setDynamicColumns(updatedColumns);

        // Update trades if needed
        if (editColumnSettings.type !== "Dropdown") {
          const updatedTrades = trades.map((trade) => ({
            ...trade,
            [editColumnSettings.name]: trade[editColumnSettings.name] || "",
          }));
          setTrades(updatedTrades);
        }
      }

      // Reset the states
      setEditColumnSettings(null);
      setTempColumnPosition(null);
    }
  };

  const handleUpdateDropdownOption = (index, field, value) => {
    setDropdownOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      if (!newOptions[index]) {
        newOptions[index] = {
          value: "",
          backgroundColor: backgroundColor,
          textColor: textColor,
        };
      }
      newOptions[index] = {
        ...newOptions[index],
        [field]: value,
      };
      return newOptions;
    });
  };

  const renderTradeCell = (trade, col, index) => {
    const cellStyle = {
      backgroundColor: col.backgroundColor || backgroundColor,
      color: col.textColor || textColor,
    };

    switch (col.type) {
      case "Dropdown":
        return (
          <select
            value={trade[col.name]}
            onChange={(e) => handleChange(index, col.name, e.target.value)}
            style={{
              ...cellStyle,
              backgroundColor:
                col.options.find((opt) => opt.value === trade[col.name])
                  ?.backgroundColor || backgroundColor,
              color:
                col.options.find((opt) => opt.value === trade[col.name])
                  ?.textColor || textColor,
            }}
          >
            {col.options.map((option, idx) => (
              <option
                key={idx}
                value={option.value}
                style={{
                  backgroundColor: option.backgroundColor || backgroundColor,
                  color: option.textColor || textColor,
                }}
              >
                {option.value}
              </option>
            ))}
          </select>
        );
      case "Date":
        return (
          <input
            type="date"
            value={trade[col.name] || ""}
            onChange={(e) => handleChange(index, col.name, e.target.value)}
            style={cellStyle}
          />
        );
      case "Time":
        return (
          <input
            type="time"
            step="1"
            value={trade[col.name] || ""}
            onChange={(e) => handleChange(index, col.name, e.target.value)}
            style={cellStyle}
          />
        );
      default:
        return (
          <input
            type="text"
            value={trade[col.name] || ""}
            onChange={(e) => handleChange(index, col.name, e.target.value)}
            style={cellStyle}
          />
        );
    }
  };

  return (
    <>
      <Editor />
      <Sidebar pageActive={"backtest"} />
      <div className="custom-edge-main-div">
        <div className="CustomEdge">
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <DeleteConfirmationPopup
              confirmDelete={confirmDelete}
              cancelDelete={cancelDelete}
            />
          )}
          {/* Filter Modal */}
          {showFilterModal && (
            <Filter
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              onClose={() => setShowFilterModal(false)}
              trades={trades}
            />
          )}
          {showAddColumnModal && (
            <AddColumnModal
              onClose={() => setShowAddColumnModal(false)}
              onSave={handleAddColumn}
              dynamicColumns={dynamicColumns} // Pass dynamicColumns as a prop
              color={textColor}
              bgcColor={backgroundColor}
              setBgcTransparent={setBgcTransparent}
              bgcTransparent={bgcTransparent}
            />
          )}
          {showDeleteColumnModal && (
            <DeleteColumnModal
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              dynamicColumns={dynamicColumns}
              handleDeleteDynamicColumn={handleDeleteDynamicColumn}
              setShowDeleteColumnModal={setShowDeleteColumnModal}
            />
          )}
          {/* Edit Dropdown Modal */}
          {editDropdownColumn && (
            <div
              className={
                bgcTransparent ? "modal-overlay transparent" : "modal-overlay"
              }
            >
              <div className="modal">
                <h3 className="modal-title">
                  Edit Dropdown Options for {editDropdownColumn}
                </h3>
                <div className="dropdown-options">
                  {dropdownOptions.map((option, index) => (
                    <div key={index} className="dropdown-option-row">
                      <input
                        type="text"
                        value={option.value || ""}
                        onChange={(e) =>
                          handleUpdateDropdownOption(
                            index,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder={`Option ${index + 1}`}
                        className="dropdown-option-input"
                      />
                      <div className="option-colors">
                        <label>B</label>
                        <input
                          type="color"
                          value={option.backgroundColor || backgroundColor}
                          onChange={(e) =>
                            handleUpdateDropdownOption(
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
                          value={option.textColor || textColor}
                          onChange={(e) =>
                            handleUpdateDropdownOption(
                              index,
                              "textColor",
                              e.target.value
                            )
                          }
                          onFocus={() => setBgcTransparent(true)}
                          onBlur={() => setBgcTransparent(false)}
                        />
                      </div>
                      <button
                        className="remove-option-button"
                        onClick={() => handleRemoveDropdownOption(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <div>
                    <Button
                      text={"Add Option"}
                      styleType={"SAVE"}
                      onClick={handleAddDropdownOption}
                    />
                  </div>
                </div>
                <div className="modal-buttons">
                  <Button
                    text={"Save"}
                    styleType={"SAVE"}
                    onClick={handleSaveDropdownOptions}
                  />

                  <Button
                    text={"Cancel"}
                    styleType={"DELETE"}
                    onClick={handleCancelEditDropdown}
                  />
                </div>
              </div>
            </div>
          )}

          {editColumnSettings && (
            <div
              className={
                bgcTransparent ? "modal-overlay transparent" : "modal-overlay"
              }
            >
              <div className="modal">
                <h3 className="modal-title">
                  Edit Column - {editColumnSettings.name}
                </h3>
                {editColumnSettings.type !== "Dropdown" && (
                  <div className="color-pickers">
                    <div className="color-picker">
                      <label>Background Color: </label>
                      <input
                        type="color"
                        value={
                          editColumnSettings.backgroundColor || backgroundColor
                        }
                        onChange={(e) =>
                          setEditColumnSettings((prevSettings) => ({
                            ...prevSettings,
                            backgroundColor: e.target.value,
                          }))
                        }
                        onFocus={() => setBgcTransparent(true)}
                        onBlur={() => setBgcTransparent(false)}
                      />
                    </div>
                    <div className="color-picker">
                      <label>Text Color: </label>
                      <input
                        type="color"
                        value={editColumnSettings.textColor || textColor}
                        onChange={(e) =>
                          setEditColumnSettings((prevSettings) => ({
                            ...prevSettings,
                            textColor: e.target.value,
                          }))
                        }
                        onFocus={() => setBgcTransparent(true)}
                        onBlur={() => setBgcTransparent(false)}
                      />
                    </div>
                  </div>
                )}
                {editColumnSettings.type === "Dropdown" && (
                  <div className="form-group">
                    <label>Dropdown Options</label>
                    {editColumnSettings.options.map((option, index) => (
                      <div key={index} className="option-row">
                        <input
                          type="text"
                          className="form-input option-input"
                          placeholder={`Option ${index + 1}`}
                          value={option.value}
                          onChange={(e) =>
                            handleUpdateDropdownOption(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                        />
                        <div className="option-colors ">
                          <label>B</label>
                          <input
                            type="color"
                            value={option.backgroundColor || backgroundColor}
                            onChange={(e) =>
                              handleUpdateDropdownOption(
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
                            value={option.textColor || textColor}
                            onChange={(e) =>
                              handleUpdateDropdownOption(
                                index,
                                "textColor",
                                e.target.value
                              )
                            }
                            onFocus={() => setBgcTransparent(true)}
                            onBlur={() => setBgcTransparent(false)}
                          />
                        </div>
                        <button
                          type="button"
                          className="remove-option-button"
                          onClick={() => handleRemoveDropdownOption(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    <Button
                      text={"Add Option"}
                      styleType={"SAVE"}
                      onClick={handleAddDropdownOption}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="number"
                    min="0"
                    max={dynamicColumns.length - 1}
                    value={tempColumnPosition}
                    onChange={(e) => {
                      const newPosition = parseInt(e.target.value, 10);
                      setTempColumnPosition(newPosition);
                    }}
                  />
                </div>
                <div className="modal-buttons">
                  <Button
                    text={"Save"}
                    styleType={"SAVE"}
                    onClick={handleSaveColumnSettings}
                  />

                  <Button
                    text={"Cancel"}
                    styleType={"DELETE"}
                    onClick={() => setEditColumnSettings(null)}
                  />
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="trade-journal-heading-summary-container">
              <div className="trade-journal-heading-container">
                <img
                  className="sidebar-icons"
                  src="Icons/sidebar/tested.png"
                  alt="Adaptive Edge"
                />
                <h3 className="trade-journal-heading">Backtesting Records</h3>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div className="trade-journal-button-container">
                <button
                  className="trade-journal-text-buttons"
                  onClick={() => setShowFilterModal(true)}
                >
                  Filters
                </button>
                <button
                  className="trade-journal-text-buttons"
                  onClick={handleExport}
                >
                  Export to Excel
                </button>
                <button
                  className="trade-journal-text-buttons"
                  onClick={() => setShowAddColumnModal(true)}
                >
                  Add Column
                </button>

                <button
                  className="trade-journal-text-buttons"
                  onClick={() => setShowDeleteColumnModal(true)}
                >
                  Delete Column
                </button>
              </div>
              {dynamicColumns.length > 0 && (
                <div>
                  <button
                    className="trade-journal-add-entry-button"
                    onClick={handleAdd}
                  >
                    + Add Record
                  </button>
                </div>
              )}
            </div>
            <div className="custom-edge-table-container">
              {dynamicColumns.length === 0 ? (
                <div className="no-columns-message">
                  <h2 style={{ marginBottom: "10px" }}>
                    Welcome to Backtesting Records!
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                    }}
                  >
                    To get started:
                    <br />
                    1. Click the "Add Column" button above
                    <br />
                    2. Choose between Input types
                    <br />
                    3. Name your column and set it up
                    <br />
                    4. Add entries to start tracking your backtested data
                    <br />
                    4. Your defined columns will appear over the brokers page
                    automatically to direct enter the data
                  </p>
                </div>
              ) : (
                <table className="custom-edge-trade-table">
                  <thead>
                    <tr>
                      {dynamicColumns.map((col, index) => (
                        <th key={col.name}>
                          {col.name}
                          <EditButton
                            onClick={() => handleEditColumnSettings(col.name)}
                          />
                        </th>
                      ))}
                      {trades.length > 0 && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {trades.length === 0 ? (
                      <tr>
                        <td
                          colSpan={dynamicColumns.length}
                          className="noColumnMsg"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No data available. Click "Add Entry" to add your first
                          record.
                        </td>
                      </tr>
                    ) : (
                      filteredTrades.map((trade, index) => (
                        <tr key={index}>
                          {dynamicColumns.map((col) => (
                            <td
                              key={col.name}
                              style={{
                                background:
                                  col.type !== "Dropdown"
                                    ? col.backgroundColor || backgroundColor
                                    : backgroundColor,
                                color: col.textColor || textColor,
                              }}
                            >
                              {renderTradeCell(trade, col, index)}
                            </td>
                          ))}
                          <td>
                            <button
                              style={{
                                marginLeft: "16px",
                                marginTop: "2px",
                                marginBottom: "2px",
                                border: "none",
                                background: "none",
                                textAlign: "center",
                              }}
                              onClick={() => handleDelete(index)}
                            >
                              <img
                                className="deleteIcon"
                                src="Icons/others/delete.png"
                                alt="Delete Entry"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const EditButton = ({ onClick }) => (
  <button className="table-edit-button" onClick={onClick}>
    <img
      src="Icons/others/pencil.png"
      style={{
        width: "13px",
        height: "13px",
      }}
      alt="Edit"
    />
  </button>
);

export default Backtest;
