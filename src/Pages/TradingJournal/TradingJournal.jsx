import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./TradingJournal.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Editor from "../../components/Editor/Editor";
import DateHeader from "../../components/DateHeader/DateHeader";
import "../../components/DateHeader/DateHeader.css";
import Filter from "../../components/TableComponents/Popups/Filter";
import AddColumnModal from "../../components/TableComponents/Popups/Add-Column";
import DeleteConfirmationPopup from "../../components/TableComponents/Popups/Delete-Confirmation-Popup";
import EditDropdownColumn from "../../components/TableComponents/Popups/Edit-Dropdown";
import DeleteColumnModal from "../../components/TableComponents/Popups/delete-column";
import Table from "../../components/TableComponents/Table/Table";
import Summary from "../../components/TradeSummary/TradeSummary";

function TradingJournal() {
  const [editingDateRow, setEditingDateRow] = useState(null);
  // Convert constant arrays to state variables
  const [instrumentOptions, setInstrumentOptions] = useState(["custom"]);
  const [segmentOptions, setsegmentOptions] = useState(["custom"]); // Add segment options
  const [dayOptions, setDayOptions] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [typeOptions, setTypeOptions] = useState(["Call", "Put"]);
  const [timeFrameOptions, setTimeFrameOptions] = useState([
    "1 min",
    "2 min",
    "3 min",
    "5 min",
    "10 min",
    "15 min",
    "30 min",
    "1 hour",
    "4 hour",
    "1 day",
  ]);

  const [tradeOptions, setTradeOptions] = useState([
    "Trade 1",
    "Trade 2",
    "Trade 3",
    "Trade 4",
    "Trade 5",
    "Trade 6",
    "Trade 7",
    "Trade 8",
    "Trade 9",
    "Trade 10",
    "Trade 11",
    "Trade 12",
    "Trade 13",
    "Trade 14",
    "Trade 15",
  ]);

  const resultOptions = ["Loss", "Profit", "Breakeven"];

  const getResultClass = (result) => {
    switch (result) {
      case "Loss":
        return "result-loss";
      case "Profit":
        return "result-profit";
      case "Breakeven":
        return "result-breakeven";
      default:
        return "";
    }
  };

  const [trades, setTrades] = useState([
    {
      date: "",
      day: dayOptions[0], // Default to the first option
      instrument: instrumentOptions[0], // Default to the first option
      segment: segmentOptions[0], // Add segment field
      trade: tradeOptions[0], // Default to the first option
      type: typeOptions[0], // Default to the first option
      timeFrame: timeFrameOptions[0], // Default to the first option
      quantity: 0, // Add Quantity field
      buyPrice: 0, // Add Buy Price field
      sellPrice: 0, // Add Sell Price field
      pointsCaptured: 0, // Add Points Captured field
      entryTime: "",
      exitTime: "",
      duration: "0",
      result: resultOptions[0], // Default to the first option
      risk: 0,
      rr: "",
      pnl: 0,
      pnlOfDemat: "+0.00%", // Add P&L of Demat (%) field
      pnlOfCapital: "+0.00%", // Add P&L of Capital (%) field
      charges: 0, // Move Charges field here
      demat: 0,
      capital: 0,
    },
  ]);
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

  const [checkPoint, setCheckPoint] = useState([]); // State for checkbox
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Add this helper function near your other utility functions
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const monthName = date.toLocaleString("default", {
      month: "long",
    });
    return (
      date.getDate().toString() +
      " " +
      monthName +
      " " +
      date.getFullYear().toString()
    );
  };

  const handleAdd = () => {
    setTrades((prevTrades) => {
      const newTrades = [
        ...prevTrades,
        {
          date: "",
          day: dayOptions[0],
          instrument: instrumentOptions[0],
          segment: segmentOptions[0], // Add segment field
          trade: tradeOptions[0],
          type: typeOptions[0],
          timeFrame: timeFrameOptions[0],
          quantity: 0, // Add Quantity field
          buyPrice: 0, // Add Buy Price field
          sellPrice: 0, // Add Sell Price field
          pointsCaptured: 0, // Add Points Captured field
          entryTime: "",
          exitTime: "",
          duration: "0",
          result: resultOptions[0],
          risk: 0,
          rr: "",
          pnl: 0,
          pnlOfDemat: "+0.00%", // Add P&L of Demat (%) field
          pnlOfCapital: "+0.00%", // Add P&L of Capital (%) field
          charges: 0, // Move Charges field here
          demat: trades[trades.length - 1].demat || 0, // Initialize with header In Demat
          capital: trades[trades.length - 1].capital || 0, // Initialize with header Capital
        },
      ];

      // Calculate if we need to advance to next page
      const currentPageItemCount = newTrades.length % rowsPerPage;
      if (currentPageItemCount === 1 && newTrades.length > rowsPerPage) {
        // If this is the first item of a new page, advance to that page
        const newPageNumber = Math.ceil(newTrades.length / rowsPerPage);
        setCurrentPage(newPageNumber);
      }

      return newTrades;
    });
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
    setTrades((prevTrades) => {
      const newTrades = prevTrades.filter((_, i) => i !== deleteIndex);

      // Calculate if we need to go back a page
      const totalPages = Math.ceil(newTrades.length / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      return newTrades;
    });
    setShowDeleteModal(false); // Hide the modal
    setDeleteIndex(null); // Reset the index
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Hide the modal
    setDeleteIndex(null); // Reset the index
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

    const profitLossMatch = (() => {
      const pnlValue = parseFloat(trade.pnl) || 0;

      const profitMinMatch =
        !filters.profitMin || pnlValue >= parseFloat(filters.profitMin);
      const profitMaxMatch =
        !filters.profitMax || pnlValue <= parseFloat(filters.profitMax);

      const lossMinMatch =
        !filters.lossMin || pnlValue <= -parseFloat(filters.lossMin);
      const lossMaxMatch =
        !filters.lossMax || pnlValue >= -parseFloat(filters.lossMax);

      return profitMinMatch && profitMaxMatch && lossMinMatch && lossMaxMatch;
    })();

    return fieldMatch && timeMatch && dateMatch && profitLossMatch;
  });

  const handleAddColumn = (columnData, position) => {
    const existingColumns = [
      "Date",
      "Day",
      "Instrument",
      "Premium",
      "No. of Trade",
      "Type",
      "Time Frame",
      "Quantity",
      "Buy Price",
      "Sell Price",
      "Points Captured",
      "Execute Time",
      "Close Time",
      "Duration",
      "Result",
      "Risk",
      "R:R Ratio",
      "P&L",
      "P&L of Demat (%)",
      "P&L of Capital (%)",
      "Charges",
      "In Demat",
      "Capital",
      ...dynamicColumns.map((col) => col.name),
    ];

    // Check if the column heading already exists
    if (
      existingColumns.some(
        (heading) => heading.toLowerCase() === columnData.name.toLowerCase()
      )
    ) {
      alert("Column already exists"); // Show message if heading exists
      return;
    }

    // Insert the new column at the specified position
    const updatedDynamicColumns = [...dynamicColumns];
    updatedDynamicColumns.splice(position, 0, columnData);

    setDynamicColumns(updatedDynamicColumns); // Update dynamic columns
    setTrades(
      trades.map((trade) => ({
        ...trade,
        [columnData.name]:
          columnData.type === "Dropdown" ? columnData.options[0] : "",
      }))
    ); // Update trades with the new column
    setShowAddColumnModal(false); // Close modal
  };

  const handleDeleteDynamicColumn = () => {
    if (selectedColumn) {
      setDynamicColumns(
        dynamicColumns.filter((col) => col.name !== selectedColumn)
      ); // Remove the column from dynamicColumns
      setTrades(
        trades.map((trade) => {
          const updatedTrade = { ...trade };
          delete updatedTrade[selectedColumn]; // Remove the column data from each trade
          return updatedTrade;
        })
      );
      setSelectedColumn(""); // Reset selected column
      setShowDeleteColumnModal(false); // Close modal
    }
  };

  const handleEditDropdown = (columnName, options) => {
    setEditDropdownColumn(columnName);
    setDropdownOptions([...options]); // Initialize with existing options
  };

  const handleAddDropdownOption = () => {
    setDropdownOptions((prevOptions) => [...prevOptions, ""]); // Add an empty option
  };

  const handleRemoveDropdownOption = (index) => {
    setDropdownOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    ); // Remove the option
  };

  const handleUpdateDropdownOption = (index, value) => {
    setDropdownOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = value; // Update the specific option
      return updatedOptions;
    });
  };

  const handleSaveDropdownOptions = () => {
    if (editDropdownColumn) {
      // Update the dropdown options for the column
      const updatedTrades = trades.map((trade) => {
        if (!dropdownOptions.includes(trade[editDropdownColumn])) {
          trade[editDropdownColumn] = dropdownOptions[0] || ""; // Reset to the first option if the current value is removed
        }
        return trade;
      });

      setTrades(updatedTrades);

      // Dynamically update the corresponding options array or dynamic column
      const optionsMap = {
        instrument: setInstrumentOptions,
        segment: setsegmentOptions,
        day: setDayOptions,
        type: setTypeOptions,
        timeFrame: setTimeFrameOptions,
        trade: setTradeOptions,
      };

      if (optionsMap[editDropdownColumn]) {
        optionsMap[editDropdownColumn](dropdownOptions); // Update the state for predefined columns
      } else {
        // Update dynamic columns
        setDynamicColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.name === editDropdownColumn
              ? { ...col, options: dropdownOptions }
              : col
          )
        );
      }

      setEditDropdownColumn(null); // Close the popup
    }
  };

  const handleCancelEditDropdown = () => {
    setEditDropdownColumn(null); // Close the popup without saving
  };

  const paginate = (trades) => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return trades.slice(indexOfFirstRow, indexOfFirstRow + rowsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedTrades = paginate(filteredTrades);
  const totalPages = Math.ceil(filteredTrades.length / rowsPerPage);

  return (
    <div className="trade-journal-main-container">
      <Editor />
      <Sidebar pageActive={"tradingjournal"} />

      <div>
        <DateHeader />
      </div>

      <div className="trading-journal-main-div">
        <div className="trade-journal-container">
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <DeleteConfirmationPopup
              cancelDelete={cancelDelete}
              confirmDelete={confirmDelete}
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
            <EditDropdownColumn
              editDropdownColumn={editDropdownColumn}
              dropdownOptions={dropdownOptions}
              handleUpdateDropdownOption={handleUpdateDropdownOption}
              handleRemoveDropdownOption={handleRemoveDropdownOption}
              handleAddDropdownOption={handleAddDropdownOption}
              handleSaveDropdownOptions={handleSaveDropdownOptions}
              handleCancelEditDropdown={handleCancelEditDropdown}
            />
          )}
          <div className="trade-journal-heading-summary-container">
            <div className="trade-journal-heading-container">
              <img
                className="trade-journal-heading-icon"
                src="Icons/sidebar/trading-analysis.png"
                alt="Find Your Edge"
              />
              <h3 className="trade-journal-heading">
                {" "}
                <span>Trading Journal</span>
              </h3>
            </div>
          </div>
          <Summary trades={trades} />

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
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
              <div className="trade-journal-button-container">
                <button
                  className="trade-journal-add-entry-button"
                  onClick={handleAdd}
                >
                  + Add Record
                </button>
              </div>
            </div>

            <Table
              paginatedTrades={paginatedTrades}
              editingDateRow={editingDateRow}
              setEditingDateRow={setEditingDateRow}
              formatDateForDisplay={formatDateForDisplay}
              dayOptions={dayOptions}
              instrumentOptions={instrumentOptions}
              segmentOptions={segmentOptions}
              tradeOptions={tradeOptions}
              typeOptions={typeOptions}
              timeFrameOptions={timeFrameOptions}
              resultOptions={resultOptions}
              getResultClass={getResultClass}
              dynamicColumns={dynamicColumns}
              handleDelete={handleDelete}
              filteredTrades={filteredTrades}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              handleEditDropdown={handleEditDropdown}
              checkPoint={checkPoint}
              trades={trades}
              setTrades={setTrades}
              journal={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradingJournal;
