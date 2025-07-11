import React, { useState } from "react";
import "./Table.css";
import { handleChange } from "./HandleChange";

const Table = ({
  paginatedTrades,
  editingDateRow,
  setEditingDateRow,
  formatDateForDisplay,
  dayOptions,
  instrumentOptions,
  segmentOptions,
  tradeOptions,
  typeOptions,
  timeFrameOptions,
  resultOptions,
  emotionsOptions,
  setupOptions,
  rulesOptions,
  getResultClass,
  dynamicColumns,
  filteredTrades,
  handleDelete,
  rowsPerPage,
  currentPage,
  totalPages,
  handlePageChange,
  handleEditDropdown,
  trades,
  checkPoint,
  setTrades,
  journal,
}) => {
  const [isNumberPnl, setIsNumberPnl] = useState(false);
  const [isNumberRisk, setIsNumberRisk] = useState(false);
  const [isNumberCapital, setIsNumberCapital] = useState(false);
  const [isNumberDemat, setIsNumberDemat] = useState(false);
  const [isNumberCharge, setIsNumberCharge] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const formatAmountToDisplay = (amount) => {
    if (amount === undefined || amount === null) {
      return "";
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return amount;
    }
    return parsedAmount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };
  return (
    <div className="table">
      <div className="table-row-count">
        {hoveredRow !== null && <div>Current Row: {hoveredRow + 1}</div>}
        {hoveredColumn !== null && (
          <div>Current Column: {hoveredColumn + 1}</div>
        )}
        Records: {filteredTrades.length}
      </div>

      <div className="table-wrapper">
        <div className="table-date-column">
          <table className="table-trade-table">
            <tr>
              <th className="table-header">Date</th>
            </tr>
            {paginatedTrades.map((trade, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() =>
                  setHoveredRow(rowIndex + (currentPage - 1) * rowsPerPage)
                }
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td
                  className="date-column-td"
                  onClick={() =>
                    setEditingDateRow(
                      rowIndex + (currentPage - 1) * rowsPerPage
                    )
                  }
                  onMouseEnter={() => setHoveredColumn(0)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  {editingDateRow === rowIndex ? (
                    <input
                      type="date"
                      style={{
                        textAlign: "left",
                        height: "40px",
                        width: "147px",
                      }}
                      value={trade.date}
                      onChange={(e) =>
                        handleChange(
                          rowIndex + (currentPage - 1) * rowsPerPage,
                          "date",
                          e.target.value,
                          trades,
                          checkPoint,
                          setTrades
                        )
                      }
                      onBlur={() => setEditingDateRow(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="sticky-column-formatted-date">
                      {trade.date
                        ? formatDateForDisplay(trade.date)
                        : "Click to set date"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>

        <div className="table-main-table">
          <table className="table-trade-table">
            <thead>
              <tr>
                <th className="table-header selectors">
                  Day
                  <EditButton
                    onClick={() => handleEditDropdown("day", dayOptions)}
                  />
                </th>
                <th className="table-header selectors">
                  Instrument
                  <EditButton
                    onClick={() =>
                      handleEditDropdown("instrument", instrumentOptions)
                    }
                  />
                </th>
                <th className="table-header selectors">
                  Premium
                  <EditButton
                    onClick={() =>
                      handleEditDropdown("segment", segmentOptions)
                    }
                  />
                </th>
                <th className="table-header selectors">
                  No. of Trade
                  <EditButton
                    onClick={() => handleEditDropdown("trade", tradeOptions)}
                  />
                </th>
                <th className="table-header selectors">
                  Type
                  <EditButton
                    onClick={() => handleEditDropdown("type", typeOptions)}
                  />
                </th>
                <th className="table-header selectors">
                  Time Frame
                  <EditButton
                    onClick={() =>
                      handleEditDropdown("timeFrame", timeFrameOptions)
                    }
                  />
                </th>
                {journal && <th className="table-header">Quantity</th>}{" "}
                {journal && <th className="table-header">Buy Price</th>}
                {journal && <th className="table-header">Sell Price</th>}
                {journal && <th className="table-header">Points Captured</th>}
                <th className="table-header">Execute Time</th>
                <th className="table-header">Close Time</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Result</th>
                {!journal && (
                  <th className="table-header selectors">
                    Emotions
                    <EditButton
                      onClick={() =>
                        handleEditDropdown("timeFrame", emotionsOptions)
                      }
                    />
                  </th>
                )}
                {!journal && (
                  <th className="table-header selectors">
                    Setup
                    <EditButton
                      onClick={() =>
                        handleEditDropdown("timeFrame", setupOptions)
                      }
                    />
                  </th>
                )}
                {!journal && (
                  <th className="table-header selectors">
                    Rules Break?
                    <EditButton
                      onClick={() =>
                        handleEditDropdown("timeFrame", rulesOptions)
                      }
                    />
                  </th>
                )}
                <th className="table-header">Risk</th>
                <th className="table-header">R:R Ratio</th>
                <th className="table-header">P&L</th>
                <th className="table-header">P&L of Demat (%)</th>
                <th className="table-header">P&L of Capital (%)</th>
                <th className="table-header">Charges</th>{" "}
                <th className="table-header">In Demat</th>
                <th className="table-header">Capital</th>
                {dynamicColumns.map((col) => (
                  <th key={col.name} className="table-header">
                    {col.name}
                    {col.type === "Dropdown" && (
                      <button
                        className="table-edit-button"
                        onClick={() =>
                          handleEditDropdown(col.name, col.options)
                        }
                      >
                        Edit
                      </button>
                    )}
                  </th>
                ))}
                <th className="table-header">Actions</th>{" "}
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade, rowIndex) => (
                <tr
                  key={rowIndex}
                  onMouseEnter={() =>
                    setHoveredRow(rowIndex + (currentPage - 1) * rowsPerPage)
                  }
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {Object.keys(trade).map((field, colIndex) => {
                    if (dynamicColumns.some((col) => col.name === field)) {
                      return null;
                    } else if (field === "date") {
                      return null;
                    }
                    return (
                      <td
                        key={field}
                        className="table-td"
                        onMouseEnter={() => setHoveredColumn(colIndex)}
                        onMouseLeave={() => setHoveredColumn(null)}
                      >
                        {field === "instrument" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {instrumentOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "segment" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {segmentOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "entryTime" || field === "exitTime" ? (
                          <input
                            type="time"
                            step="1"
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          />
                        ) : field === "pnl" ? (
                          <input
                            onClick={() => {
                              setIsNumberPnl(true);
                            }}
                            type={isNumberPnl ? "number" : "text"}
                            readOnly={!isNumberPnl}
                            value={
                              isNumberPnl
                                ? trade[field]
                                : formatAmountToDisplay(trade[field])
                            }
                            onChange={(e) => {
                              if (e.target.value > 1000000000)
                                e.target.value = 1000000000;
                              if (e.target.value < -1000000000)
                                e.target.value = -1000000000;
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              );
                            }}
                            onMouseLeave={() => {
                              setIsNumberPnl(false);
                            }}
                            style={{
                              fontWeight: "bold",
                              color: (() => {
                                const value = parseInt(trade[field]) || 0;
                                return value === 0
                                  ? ``
                                  : value < 0
                                  ? `#ff6262` // Red for negative values
                                  : `#05ab72`; // Green for positive values
                              })(),
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                          />
                        ) : field === "risk" ? (
                          <input
                            onClick={() => {
                              setIsNumberRisk(true);
                            }}
                            type={isNumberRisk ? "number" : "text"}
                            readOnly={!isNumberRisk}
                            value={
                              isNumberRisk
                                ? trade[field]
                                : formatAmountToDisplay(trade[field])
                            }
                            onChange={(e) => {
                              if (e.target.value > 1000000000)
                                e.target.value = 1000000000;
                              if (e.target.value < -1000000000)
                                e.target.value = -1000000000;
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              );
                            }}
                            onMouseLeave={() => {
                              setIsNumberRisk(false);
                            }}
                            style={{
                              fontWeight: "bold",
                              color: "#ff6262",
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                          />
                        ) : field === "rr" ? (
                          <input
                            type="text"
                            readOnly
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                            style={{
                              fontWeight: "bold",
                              color: (() => {
                                if (trade[field] < 0) {
                                  return `#ff6262`;
                                } else if (trade[field] === 0) {
                                  return `rgb(89, 89, 89)`;
                                }
                                return `#05ab72`; // Green for R:R Ratio
                              })(),
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                          />
                        ) : field === "capital" ? (
                          <input
                            onClick={() => {
                              setIsNumberCapital(true);
                            }}
                            type={isNumberCapital ? "number" : "text"}
                            readOnly={!isNumberCapital}
                            value={
                              isNumberCapital
                                ? trade[field]
                                : formatAmountToDisplay(trade[field])
                            }
                            onChange={(e) => {
                              if (e.target.value > 1000000000)
                                e.target.value = 1000000000;
                              if (e.target.value < -1000000000)
                                e.target.value = -1000000000;
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              );
                            }}
                            onMouseLeave={() => {
                              setIsNumberCapital(false);
                            }}
                            style={{
                              fontWeight: "bold",
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                          />
                        ) : field === "demat" ? (
                          <input
                            onClick={() => {
                              setIsNumberDemat(true);
                            }}
                            type={isNumberDemat ? "number" : "text"}
                            readOnly={!isNumberDemat}
                            value={
                              isNumberDemat
                                ? trade[field]
                                : formatAmountToDisplay(trade[field])
                            }
                            onChange={(e) => {
                              if (e.target.value > 1000000000)
                                e.target.value = 1000000000;
                              if (e.target.value < -1000000000)
                                e.target.value = -1000000000;
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              );
                            }}
                            onMouseLeave={() => {
                              setIsNumberDemat(false);
                            }}
                            style={{
                              fontWeight: "bold",
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                          />
                        ) : field === "charges" ? (
                          <td className="table-charges" key={field}>
                            <input
                              onClick={() => {
                                setIsNumberCharge(true);
                              }}
                              type={isNumberCharge ? "number" : "text"}
                              readOnly={!isNumberCharge}
                              value={
                                isNumberCharge
                                  ? trade[field]
                                  : formatAmountToDisplay(trade[field])
                              }
                              style={{
                                width: `${Math.max(
                                  trade[field]?.length || 1,
                                  5
                                )}ch`,
                              }}
                              onChange={(e) => {
                                if (e.target.value > 1000000000)
                                  e.target.value = 1000000000;
                                if (e.target.value < -1000000000)
                                  e.target.value = -1000000000;
                                handleChange(
                                  rowIndex + (currentPage - 1) * rowsPerPage,
                                  field,
                                  e.target.value,
                                  trades,
                                  checkPoint,
                                  setTrades
                                );
                              }}
                              onMouseLeave={() => {
                                setIsNumberCharge(false);
                              }}
                            />
                          </td>
                        ) : field === "day" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {dayOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "trade" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {tradeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "type" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {typeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "timeFrame" ? (
                          <select
                            style={{ width: "100%" }}
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {timeFrameOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "quantity" ? (
                          <input
                            type="number"
                            value={trade[field]}
                            style={{
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          />
                        ) : field === "buyPrice" || field === "sellPrice" ? (
                          <input
                            type="number"
                            value={trade[field]}
                            style={{
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          />
                        ) : field === "pointsCaptured" ? (
                          <input
                            className="table-points-captured"
                            key={field}
                            type="text"
                            value={trade[field]}
                            style={{
                              fontWeight: "bold",
                              color: (() => {
                                if (trade[field] < 0) {
                                  return `#ff6262`;
                                } else if (trade[field] === 0) {
                                  return `rgb(89, 89, 89)`;
                                }
                                return `#05ab72`; // Green for R:R Ratio
                              })(),
                              width: `${Math.max(
                                trade[field]?.length || 1,
                                5
                              )}ch`,
                            }}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          />
                        ) : field === "result" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                            className={getResultClass(trade[field])} // Apply dynamic class
                          >
                            {resultOptions.map((option) => (
                              <option
                                key={option}
                                value={option}
                                className={getResultClass(option)}
                              >
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "emotions" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {emotionsOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "setup" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {setupOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "rules" ? (
                          <select
                            value={trade[field]}
                            onChange={(e) =>
                              handleChange(
                                rowIndex + (currentPage - 1) * rowsPerPage,
                                field,
                                e.target.value,
                                trades,
                                checkPoint,
                                setTrades
                              )
                            }
                          >
                            {rulesOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field === "duration" ? (
                          <input type="text" value={trade[field]} />
                        ) : field === "pnlOfDemat" ||
                          field === "pnlOfCapital" ? (
                          <td key={field}>
                            <input
                              type="text"
                              value={trade[field]}
                              readOnly
                              style={{
                                fontWeight: "bold",
                                color: trade[field].startsWith("+")
                                  ? "#05ab72" // Green for positive values
                                  : "#ff6262", // Red for negative values
                                width: "100%",
                              }}
                            />
                          </td>
                        ) : null}
                      </td>
                    );
                  })}
                  {dynamicColumns.map((col) => (
                    <td key={col.name} className="table-td">
                      {col.type === "Dropdown" ? (
                        <select
                          value={trade[col.name]}
                          onChange={(e) =>
                            handleChange(
                              rowIndex + (currentPage - 1) * rowsPerPage,
                              col.name,
                              e.target.value,
                              trades,
                              checkPoint,
                              setTrades
                            )
                          }
                        >
                          {col.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={trade[col.name]}
                          onChange={(e) =>
                            handleChange(
                              rowIndex + (currentPage - 1) * rowsPerPage,
                              col.name,
                              e.target.value,
                              trades,
                              checkPoint,
                              setTrades
                            )
                          }
                        />
                      )}
                    </td>
                  ))}
                  <td className="table-td bin">
                    <button
                      style={{
                        marginLeft: "16px",
                        marginTop: "2px",
                        marginBottom: "2px",
                        border: "none",
                        background: "none",
                        textAlign: "center",
                      }}
                      onClick={() =>
                        handleDelete(rowIndex + (currentPage - 1) * rowsPerPage)
                      }
                    >
                      <img
                        className="table-delete-icon"
                        src="Icons/others/delete.png"
                        alt="Delete Entry"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="edge-pagination">
        <button
          className="edge-page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div
          style={{
            width: "100px",
            overflow: "visible",
            scrollbarWidth: "thin",
            textAlign: "center",
          }}
        >
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
        <button
          className="edge-page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

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

export default Table;
