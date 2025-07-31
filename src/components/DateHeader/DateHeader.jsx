import React from "react";
import { useState, useContext } from "react";
import { UIContext } from "../../context/UIContext";

export default function DateHeader() {
  const { isSidebarOpen } = useContext(UIContext);
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const monthName = date.toLocaleString("default", {
      month: "long",
    });
    return (
      date.getDate().toString() +
      " " +
      monthName.substring(0, 3) +
      " " +
      date.getFullYear().toString()
    );
  };
  const [headerDate, setHeaderDate] = useState(new Date()); // State for header date
  const [headerDate2, setHeaderDate2] = useState(new Date()); // State for header date 2

  const [isHovered, setIsHovered] = useState(false); // State for hover effect
  const [isHovered2, setIsHovered2] = useState(false); // State for hover effect 2
  return (
    <div className={isSidebarOpen ? "date-header open" : "date-header"}>
      Segment:
      <select type="text">
        <option value="today">FnO</option>
        <option value="yesterday">Stocks</option>
        <option value="lastWeek">Commodity</option>
      </select>
      For:
      <select type="text">
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
      </select>
      <div onClick={() => setIsHovered(true)}>
        {isHovered ? (
          <input
            type="date"
            style={{ height: "17.5px" }}
            onChange={(e) => {
              setHeaderDate(e.target.value);
            }}
            onBlur={() => setIsHovered(false)}
            autoFocus
          />
        ) : (
          <span
            className="formatted-date"
            style={{
              width: "91px",
              border: "1px solid rgb(193, 193, 193)",
              borderRadius: "5px",
              padding: "5px 9.5px",
              height: "17.5px",
            }}
          >
            {headerDate
              ? formatDateForDisplay(headerDate)
              : "Click to set date"}
          </span>
        )}
      </div>
      to
      <div onClick={() => setIsHovered2(true)}>
        {isHovered2 ? (
          <input
            type="date"
            style={{ height: "17.5px" }}
            onChange={(e) => {
              setHeaderDate2(e.target.value);
            }}
            onBlur={() => setIsHovered2(false)}
            autoFocus
          />
        ) : (
          <span
            className="formatted-date"
            style={{
              width: "91px",
              border: "1px solid rgb(193, 193, 193)",
              borderRadius: "5px",
              padding: "5px 9.5px",
              height: "17.5px",
            }}
          >
            {headerDate2
              ? formatDateForDisplay(headerDate2)
              : "Click to set date"}
          </span>
        )}
      </div>
    </div>
  );
}
