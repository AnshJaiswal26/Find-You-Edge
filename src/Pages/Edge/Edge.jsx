import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./Edge.css";
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
import Summary from "../../components/SummaryHeader/Summary";

function Edge() {
  const [editingDateRow, setEditingDateRow] = useState(null);
  const [instrumentOptions, setInstrumentOptions] = useState(["custom"]);
  const [segmentOptions, setsegmentOptions] = useState(["custom"]);
  const [dayOptions, setDayOptions] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [typeOptions, setTypeOptions] = useState(["Call 📈", "Put 📉"]);
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

  const [emotionsOptions, setEmotionsOptions] = useState([
    "Fear 😱",
    "Greedy 🤑",
    "Neutralm 😐",
    "Confident 😌",
    "Over Confident 😏",
    "Hope 🤞",
    "Excited 🤩",
    "Anxiety 😰",
    "Anger 😡",
    "Relaxed 💆",
    "Frustrated 😤",
    "Fear of Missing Out 😓",
  ]);

  const [rulesOptions, setRulesOptions] = useState([
    "No",
    "Yes (Overtrading)",
    "Yes (Risk more then Calculated Risk)",
    "Yes (Overtrading & FOMO Entry)",
  ]);

  const [setupOptions, setSetupOptions] = useState(["custom"]);

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
      day: dayOptions[0],
      instrument: instrumentOptions[0],
      segment: segmentOptions[0],
      trade: tradeOptions[0],
      type: typeOptions[0],
      timeFrame: timeFrameOptions[0],
      entryTime: "",
      exitTime: "",
      duration: "0",
      result: resultOptions[0],
      emotions: emotionsOptions[0],
      setup: setupOptions[0],
      rules: rulesOptions[0],
      risk: 0,
      rr: "",
      pnl: 0,
      pnlOfDemat: "+0.00%",
      pnlOfCapital: "+0.00%",
      charges: 0,
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
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [editDropdownColumn, setEditDropdownColumn] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const [checkPoint, setCheckPoint] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

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
          segment: segmentOptions[0],
          trade: tradeOptions[0],
          type: typeOptions[0],
          timeFrame: timeFrameOptions[0],
          entryTime: "",
          exitTime: "",
          duration: "0",
          result: resultOptions[0],
          emotions: emotionsOptions[0],
          setup: setupOptions[0],
          rules: rulesOptions[0],
          risk: 0,
          rr: "",
          pnl: 0,
          pnlOfDemat: "+0.00%",
          pnlOfCapital: "+0.00%",
          charges: 0,
          demat: trades[trades.length - 1].demat || 0,
          capital: trades[trades.length - 1].capital || 0,
        },
      ];

      // Calculate if we need to advance to next page
      const currentPageItemCount = newTrades.length % rowsPerPage;
      if (currentPageItemCount === 1 && newTrades.length > rowsPerPage) {
        const newPageNumber = Math.ceil(newTrades.length / rowsPerPage);
        setCurrentPage(newPageNumber);
      }

      return newTrades;
    });
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(trades);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");

    XLSX.writeFile(workbook, "trades.xlsx");
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setTrades((prevTrades) => {
      const newTrades = prevTrades.filter((_, i) => i !== deleteIndex);

      const totalPages = Math.ceil(newTrades.length / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      return newTrades;
    });
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
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

  const filteredTrades = trades.filter((trade) => {
    const fieldMatch = (() => {
      if (!filters.field || !filters.value) return true;
      const fieldValue = trade[filters.field]?.toString().toLowerCase() || "";
      const filterValue = filters.value.toLowerCase();
      return fieldValue.includes(filterValue);
    })();

    const timeMatch = (() => {
      if (!filters.startTime && !filters.endTime) return true;
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
      if (!filters.startDate && !filters.endDate) return true;
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
      "Execute Time",
      "Close Time",
      "Duration",
      "Result",
      "Emotions",
      "Setup",
      "Riles Break?",
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

    if (
      existingColumns.some(
        (heading) => heading.toLowerCase() === columnData.name.toLowerCase()
      )
    ) {
      alert("Column already exists");
      return;
    }

    const updatedDynamicColumns = [...dynamicColumns];
    updatedDynamicColumns.splice(position, 0, columnData);

    setDynamicColumns(updatedDynamicColumns);
    setTrades(
      trades.map((trade) => ({
        ...trade,
        [columnData.name]:
          columnData.type === "Dropdown" ? columnData.options[0] : "",
      }))
    );
    setShowAddColumnModal(false);
  };

  const handleDeleteDynamicColumn = () => {
    if (selectedColumn) {
      setDynamicColumns(
        dynamicColumns.filter((col) => col.name !== selectedColumn)
      );
      setTrades(
        trades.map((trade) => {
          const updatedTrade = { ...trade };
          delete updatedTrade[selectedColumn];
          return updatedTrade;
        })
      );
      setSelectedColumn("");
      setShowDeleteColumnModal(false);
    }
  };

  const handleEditDropdown = (columnName, options) => {
    setEditDropdownColumn(columnName);
    setDropdownOptions([...options]);
  };

  const handleAddDropdownOption = () => {
    setDropdownOptions((prevOptions) => [...prevOptions, ""]);
  };

  const handleRemoveDropdownOption = (index) => {
    setDropdownOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    );
  };

  const handleUpdateDropdownOption = (index, value) => {
    setDropdownOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
  };

  const handleSaveDropdownOptions = () => {
    if (editDropdownColumn) {
      const updatedTrades = trades.map((trade) => {
        if (!dropdownOptions.includes(trade[editDropdownColumn])) {
          trade[editDropdownColumn] = dropdownOptions[0] || "";
        }
        return trade;
      });

      setTrades(updatedTrades);

      const optionsMap = {
        instrument: setInstrumentOptions,
        segment: setsegmentOptions,
        day: setDayOptions,
        type: setTypeOptions,
        timeFrame: setTimeFrameOptions,
        trade: setTradeOptions,
      };

      if (optionsMap[editDropdownColumn]) {
        optionsMap[editDropdownColumn](dropdownOptions);
      } else {
        setDynamicColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.name === editDropdownColumn
              ? { ...col, options: dropdownOptions }
              : col
          )
        );
      }

      setEditDropdownColumn(null);
    }
  };

  const handleCancelEditDropdown = () => {
    setEditDropdownColumn(null);
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
    <div>
      <Editor />
      <Sidebar pageActive={"edge"} />

      <div className="edge-main-div">
        <DateHeader />

        <div className="edge-container">
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
              dynamicColumns={dynamicColumns}
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
          <div className="edge-heading-container">
            <img
              className="edge-heading-icon"
              src="Icons/sidebar/edge.png"
              alt="Find Your Edge"
            />
            <h3 className="edge-heading">
              {" "}
              <span>Find Your Edge</span>
            </h3>
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
              <div className="edge-button-container">
                <button
                  className="edge-text-buttons"
                  onClick={() => setShowFilterModal(true)}
                >
                  Filters
                </button>
                <button className="edge-text-buttons" onClick={handleExport}>
                  Export to Excel
                </button>
                <button
                  className="edge-text-buttons"
                  onClick={() => setShowAddColumnModal(true)}
                >
                  Add Column
                </button>

                <button
                  className="edge-text-buttons"
                  onClick={() => setShowDeleteColumnModal(true)}
                >
                  Delete Column
                </button>
              </div>
              <div className="edge-button-container">
                <button className="edge-add-entry-button" onClick={handleAdd}>
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
              emotionsOptions={emotionsOptions}
              setupOptions={setupOptions}
              rulesOptions={rulesOptions}
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
              journal={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edge;
