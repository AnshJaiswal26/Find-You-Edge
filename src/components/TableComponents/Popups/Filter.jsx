import "./Popup.css";
import Button from "../../Button/Button";

const Filter = ({
  filters,
  handleFilterChange,
  clearFilters,
  onClose,
  trades,
}) => {
  const formattedData = {
    date: "Date",
    day: "Day",
    instrument: "Instrument",
    segment: "Premium",
    tradeCount: "No. of Trade",
    tradeType: "Type",
    timeFrame: "Time Frame",
    quantity: "Quantity",
    buyPrice: "Buy Price",
    sellPrice: "Sell Price",
    pointsCaptured: "Points Captured",
    entryTime: "Execute Time",
    exitTime: "Close Time",
    duration: "Duration",
    result: "Result",
    emotions: "Emotions",
    setup: "Setup",
    rules: "Rules Break?",
    risk: "Risk",
    rrRatio: "R:R Ratio",
    pnl: "P&L",
    pnlOfDemat: "P&L of Demat (%)",
    pnlOfCapital: "P&L of Capital (%)",
    charges: "Charges",
    demat: "In Demat",
    capital: "Capital",
  };

  const formatFieldName = (field) => {
    return formattedData[field] ? formattedData[field] : null;
  };

  return (
    <div className="modal-overlay-filter">
      <div className="modal-filter">
        <div style={{ textAlign: "right" }}>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <h3>Filter Options</h3>
        <div className="filter-options">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div className="filter-group">
              <label>Field</label>
              <select
                value={filters.field}
                onChange={(e) => handleFilterChange("field", e.target.value)}
              >
                <option value="">None</option>
                {Object.keys(trades[0] || {}).map((field) =>
                  formattedData[field] ? (
                    <option key={field} value={field}>
                      {formatFieldName(field)}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className="filter-group">
              <label>Filter Value</label>
              <input
                type="text"
                placeholder="Filter Value"
                value={filters.value}
                onChange={(e) => handleFilterChange("value", e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div className="filter-group">
              <label>Start Time</label>
              <input
                type="time"
                value={filters.startTime}
                onChange={(e) =>
                  handleFilterChange("startTime", e.target.value)
                }
              />
            </div>
            <div className="filter-group">
              <label>End Time</label>
              <input
                type="time"
                value={filters.endTime}
                onChange={(e) => handleFilterChange("endTime", e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div className="filter-group">
              <label>Profit Min</label>
              <input
                type="number"
                placeholder="Profit Min"
                value={filters.profitMin}
                onChange={(e) =>
                  handleFilterChange("profitMin", e.target.value)
                }
              />
            </div>
            <div className="filter-group">
              <label>Profit Max</label>
              <input
                type="number"
                placeholder="Profit Max"
                value={filters.profitMax}
                onChange={(e) =>
                  handleFilterChange("profitMax", e.target.value)
                }
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div className="filter-group">
              <label>Loss Min</label>
              <input
                type="number"
                placeholder="Loss Min"
                value={filters.lossMin}
                onChange={(e) => handleFilterChange("lossMin", e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Loss Max</label>
              <input
                type="number"
                placeholder="Loss Max"
                value={filters.lossMax}
                onChange={(e) => handleFilterChange("lossMax", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button text="Clear Filters" onClick={clearFilters} color="#05ab72" />
          <Button text="Apply Filters" onClick={onClose} color="#05ab72" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
