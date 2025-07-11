import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

function RRPerformanceBarChart({ data, theme, isSidebarOpen }) {
  const rrData = [
    { "R/R": -0.93 },
    { "R/R": -0.97 },
    { "R/R": -0.6 },
    { "R/R": -0.88 },
    { "R/R": -1.01 },
    { "R/R": -1.38 },
    { "R/R": -0.95 },
    { "R/R": 0.2 },
    { "R/R": 1.75 },
    { "R/R": -1.02 },
    { "R/R": 0.36 },
    { "R/R": -0.07 },
    { "R/R": -0.23 },
    { "R/R": -0.88 },
    { "R/R": -1.03 },
    { "R/R": 2.28 },
    { "R/R": 0.0 },
    { "R/R": 2.37 },
    { "R/R": -0.95 },
    { "R/R": -0.95 },
    { "R/R": -0.23 },
    { "R/R": 0.19 },
    { "R/R": -1.0 },
    { "R/R": 2.56 },
  ];

  // Pagination logic
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const [fullSize, setFullSize] = useState(false);
  const totalPages = Math.ceil(rrData.length / pageSize);

  const paginatedData = fullSize
    ? rrData
    : rrData.slice(page * pageSize, page * pageSize + pageSize);

  const categories = paginatedData.map((_, idx) =>
    fullSize ? `Trade ${idx + 1}` : `Trade ${page * pageSize + idx + 1}`
  );
  const rrSeries = paginatedData.map((item) => item["R/R"]);

  const best = Math.max(...rrSeries);
  const worst = Math.min(...rrSeries);

  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(false);

  const checkPrevButton = () => {
    setPage((p) => Math.max(0, p - 1));
    page === 1 ? setPrevDisabled(true) : setNextDisabled(false);
  };

  const checkNextButton = () => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
    page === totalPages - 2 ? setNextDisabled(true) : setPrevDisabled(false);
  };

  const apexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
        selection: { enabled: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 200,
        },
      },
      grid: {
        borderColor: theme === "dark" ? "#333e47" : "#e9ecee",
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          borderRadius: 2,
          distributed: false,
          colors: {
            ranges: [
              {
                from: 0.6,
                to: 100,
                color: "#05ab72",
              },
              {
                from: 0,
                to: 0.5,
                color: "#f8c75f",
              },
              {
                from: -100,
                to: -0.00001,
                color: "#fe5a5a",
              },
            ],
          },
          barHeight: "100%",
        },
      },
      xaxis: {
        categories,
        tooltip: {
          enabled: true,
        },
        labels: {
          show: false, // Hide x-axis labels when showing all
          rotate: -45,
          offsetX: 0,
          style: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
        title: {
          text: "Trades",
          style: {
            fontSize: "14px",
            color: theme === "dark" ? "#637381" : "#919eab",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value) => value.toFixed(2),
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
      },
      tooltip: {
        theme: "light",
        shared: false,
        intersect: false,
        followCursor: false,
        fixed: {
          enabled: false,
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const value = rrSeries[dataPointIndex];
          return `
            <div style="min-width:80px;text-align:center;color:#34495e">
              <div style="padding:6px;font-weight:bold;font-size:14px;text-align:center;color:${
                theme === "dark" ? "#919eab" : "#34495e"
              };background-color:${
            theme === "dark" ? "#28323d" : "rgb(236, 240, 244)"
          }">${categories[dataPointIndex]}</div>
              <div style="padding:10px 10px;display:flex;align-items:center;gap:5px;font-size:14px;color:${
                value >= 0.6
                  ? "#05ab72"
                  : value <= 0.5 && value >= 0
                  ? "#f8c75f"
                  : "#fe5a5a"
              };">
              <div style="border-radius:50%;height:10px;width:10px;background-color: ${
                value >= 0.6
                  ? "#05ab72"
                  : value <= 0.5 && value >= 0
                  ? "#f8c75f"
                  : "#fe5a5a"
              };"></div>
               <div style=" color: ${
                 theme === "dark" ? "#fff" : "#000"
               };font-size:14px">${
            value >= 0.6
              ? "Reward Taken"
              : value <= 0.5 && value >= 0
              ? "Breakeven"
              : "Risk Taken"
          }</div>  <div style="font-weight:bolder">${value.toFixed(2)}</div>
              </div>
            </div>
          `;
        },
      },

      stroke: {
        show: true,
        width: 0.5,
        colors: [theme === "dark" ? "#333" : "#fff"],
      },
      dataLabels: {
        enabled: false,
      },
      legend: { show: false },
      annotations: {
        yaxis: [
          {
            y: -1,
            borderColor: "inherit",
            strokeDashArray: 3,
            label: {
              borderColor: "inherit",
              style: {
                color: "#fe5a5a",
                fontSize: "13px",
                opacity: 0.8,
                fontWeight: "bold",
                padding: 0,
              },
              text: "maximum (-1)",
              position: "center",
              offsetY: 13,
              offsetX: 0,
            },
          },

          {
            y: 2,
            borderColor: "inherit",
            strokeDashArray: 3,
            label: {
              borderColor: "inherit",
              style: {
                zIndex: -1,
                color: "#05ab72",
                fontSize: "13px",
                fontWeight: "bold",
                padding: 0,
              },
              text: "minimum (1 : 2)",
              position: "center",
              offsetY: 0,
              offsetX: 0,
            },
          },
          {
            y: 3,
            borderColor: "inherit",
            strokeDashArray: 3,
            label: {
              borderColor: "inherit",
              style: {
                zIndex: -1,
                color: "#05ab72",
                fontSize: "13px",
                fontWeight: "bold",
                padding: 0,
              },
              text: "Good (1 : 3)",
              position: "center",
              offsetY: 0,
              offsetX: 0,
            },
          },
        ],
      },
    }),
    [theme, categories, rrSeries, fullSize, isSidebarOpen]
  );

  const apexSeries = [
    {
      name: "R/R",
      data: rrSeries,
    },
  ];

  return (
    <div className="rr-performance-bar-chart-container">
      <div>
        <h3>P&L Booked on Risk/Reward</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Best:</span>
            <span
              className={best > 0 ? "badge badge-profit" : "badge badge-loss"}
            >{`1 : ${best}`}</span>
            <span>worst:</span>
            <span
              className={worst > 0 ? "badge badge-profit" : "badge badge-loss"}
            >
              {worst}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            {rrData.length > pageSize && (
              <button
                onClick={() => setFullSize((v) => !v)}
                className="show-button"
              >
                {" "}
                {fullSize ? "Show Paginated" : "Show All"}
              </button>
            )}
            {!fullSize && rrData.length > pageSize && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => checkPrevButton()}
                  className={`prev-button ${
                    prevDisabled || page === 0 ? "disabled" : ""
                  }`}
                  disabled={prevDisabled || page === 0}
                  style={{ marginRight: 8 }}
                >
                  Prev
                </button>
                <span>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className={`next-button ${nextDisabled ? "disabled" : ""}`}
                  onClick={() => checkNextButton()}
                  disabled={nextDisabled}
                  style={{ marginLeft: 8 }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Chart
        options={apexOptions}
        series={apexSeries}
        type="bar"
        height={"410px"}
        width={"100%"}
      />
    </div>
  );
}

export default RRPerformanceBarChart;
