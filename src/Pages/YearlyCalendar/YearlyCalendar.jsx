import React, { useState } from "react";
import "./YearlyCalendar.css";
import "./Dark-YearlyCalendar.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Editor from "../../components/Editor/Editor";

const YearlyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTrade, setSelectedTrade] = useState(null);

  const data = [
    { date: "2025-04-18", type: "profit", amount: 500, instrument: "AAPL" },
    { date: "2025-04-15", type: "loss", amount: 200, instrument: "TSLA" },
    { date: "2025-04-16", type: "no-trade" },
  ];
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handleDateClick = (date) => {
    const trade = data.find((d) => d.date === date);
    setSelectedTrade(trade || { date, type: "no-trade" });
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();

    const weeks = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (day > days) {
          week.push(null);
        } else {
          week.push(day++);
        }
      }
      if (week.some((d) => d !== null)) {
        weeks.push(week);
      }
    }

    return (
      <>
        <div className="calendar-row">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div key={index} className="calendar-header-cell">
                {day}
              </div>
            )
          )}
        </div>
        {weeks.map((week, i) => (
          <div key={i} className="calendar-row">
            {week.map((day, j) => {
              const date = day
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                    day
                  ).padStart(2, "0")}`
                : null;
              const trade = data.find((d) => d.date === date);
              const isToday =
                day &&
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;

              return (
                <div
                  key={j}
                  className={`calendar-cell ${isToday ? "today" : ""} ${
                    trade?.type === "profit"
                      ? "profit"
                      : trade?.type === "loss"
                      ? "loss"
                      : day
                      ? "no-trade"
                      : ""
                  }`}
                  onClick={() => day && handleDateClick(date)}
                >
                  {day || ""}
                  {trade?.type === "no-trade"}
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <Editor />
      <Sidebar pageActive={"yearlycalender"} />
      <div className="yearly-calendar-main-div">
        <div className="calendar-and-popup-container ">
          <div className="calendar-wrapper">
            <div className="calendar-header">
              <button onClick={handlePrevMonth}>&lt;</button>
              <h2>
                {currentDate.toLocaleString("default", { month: "long" })}{" "}
                {currentDate.getFullYear()}
              </h2>
              <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar">{renderCalendar()}</div>
          </div>
          <div className="popup-wrapper">
            <div className="popup-summary">
              <h3>Net Realised P&L</h3>
              <div>
                <span className="pnl-amount">₹-3,357.77</span>
                <span className="for-month">for Oct 2024</span>
              </div>
              <div className="summary-stats">
                <div className="trading-days">
                  <p>22</p>
                  <p>Trading Days</p>
                </div>
                <div className="traded-on">
                  <p>6</p>
                  <p>Traded On</p>
                </div>
                <div className="in-profit-days">
                  <p>0</p>
                  <p>In-Profit Days</p>
                </div>
                <div className="winning-streak">
                  <p>0</p>
                  <p>Winning Streak</p>
                </div>
              </div>
              <div className="most-profitable-days">
                <h4>Most Profitable Days</h4>
                <div>
                  <div className="profitable-day-row">
                    <div>
                      <img src="Icons/others/triangle.png" alt="see" />
                      <span>In this period:</span>
                      <strong>17 Oct 2024</strong>
                    </div>
                    <span className="pnl-negative">₹-249.00</span>
                  </div>
                  <div className="profitable-day-row">
                    <div>
                      <img src="Icons/others/triangle.png" alt="see" />
                      <span>Of all time:</span>
                      <strong>17 Oct 2024</strong>
                    </div>
                    <span className="pnl-negative">₹-249.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="popup-overview">
              <div className="popup-header">
                <span className="overview-month">Oct 23, 2024</span>
                <span className="pnl-amount">₹-1,059.75</span>
              </div>
              <div>
                <div className="trade-overview">
                  <img src="Icons/others/trading.png" alt="Trade Overview" />
                  <h4>Trade Overview</h4>
                </div>
                <div className="trade-overview-details">
                  <div className="trade-detail-column">
                    <p>
                      <strong>Overall P&L:</strong>{" "}
                      <span className="negative">₹-1,059.75</span>
                    </p>
                    <p>
                      <strong>Govt Charges:</strong> ₹22.45
                    </p>
                  </div>
                  <div className="trade-detail-column">
                    <p>
                      <strong>Net P&L:</strong>{" "}
                      <span className="negative">₹-1,162.20</span>
                    </p>
                    <p>
                      <strong>Brokerage:</strong> ₹80.00
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "last baseline" }}>
                    <p>
                      <strong>Trades:</strong> 4
                    </p>
                  </div>
                </div>
              </div>
              <div className="popup-footer">
                <p>See trades for this period with your trading details.</p>
                <button className="view-button">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyCalendar;
