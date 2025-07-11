import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import Button from "../../../components/Button/Button";

function CapitalGrowthLineChart({ data, theme, isSidebarOpen }) {
  const [audienceMetricsData, setAudienceMetricsData] = useState([
    { day: "", capital: 15000 },
    { day: "Day 1", capital: 14500 },
    { day: "Day 2", capital: 16000 },
    { day: "Day 3", capital: 15500 },
    { day: "Day 4", capital: 17500 },
    { day: "Day 5", capital: 16000 },
    { day: "Day 6", capital: 18500 },
    { day: "Day 7", capital: 17000 },
    { day: "Day 8", capital: 19500 },
    { day: "Day 9", capital: 19500 },
    { day: "Day 10", capital: 20000 },
    { day: "Day 11", capital: 19500 },
    { day: "Day 12", capital: 23000 },
    { day: "Day 13", capital: 20500 },
    { day: "Day 14", capital: 21500 },
    { day: "Day 15", capital: 23000 },
    { day: "Day 16", capital: 26500 },
    { day: "Day 17", capital: 23000 },
    { day: "Day 18", capital: 27500 },
    { day: "Day 19", capital: 26500 },
    { day: "Day 20", capital: 27000 },
    { day: "Day 21", capital: 28500 },
    { day: "Day 22", capital: 29000 },
    { day: "Day 23", capital: 28500 },
    { day: "Day 24", capital: 24300 },
  ]);

  // Pagination logic
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(audienceMetricsData.length / pageSize);

  const [fullSize, setFullSize] = useState(false);

  const [isDematCapital, setIsTotalCapital] = useState(true);

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

  const handleCapitalChange = () => {
    setIsTotalCapital(!isDematCapital);
    const newData = isDematCapital
      ? audienceMetricsData.map((item) => ({
          ...item,
          capital: item.capital + 10000,
        }))
      : audienceMetricsData.map((item) => ({
          ...item,
          capital: item.capital - 10000,
        }));

    setAudienceMetricsData(newData);
  };

  const paginatedData = fullSize
    ? audienceMetricsData
    : audienceMetricsData.slice(
        page !== 0 ? page * pageSize - 1 : page * pageSize,
        page * pageSize + pageSize
      );

  const val1 = paginatedData[0].capital;
  const val2 = paginatedData[paginatedData.length - 1].capital;
  const diff = val2 - val1;

  const categories = paginatedData.map((item) => item.day);
  const capitalSeries = paginatedData.map((item) => item.capital);

  const handleGrowthChange = (val, index) => {
    const previousValue = index > 0 ? capitalSeries[index - 1] : null;

    const diff = previousValue !== null ? val - previousValue : 0;
    const initialCapital = audienceMetricsData[0].capital;
    const indicatorColor =
      diff === 0
        ? theme === "dark"
          ? "#ccc"
          : "#3d4753"
        : diff > 0
        ? "#05ab72"
        : "#fe5a5a";

    const formattedPercentage = parseFloat(
      (diff / initialCapital) * 100
    ).toFixed(2);

    const percentage =
      formattedPercentage % 1 === 0
        ? parseInt(formattedPercentage)
        : formattedPercentage;

    const returns =
      diff >= 0 ? "(+" + percentage + "%)" : "(" + percentage + "%)";

    return `<div style="padding:5px 10px 10px 10px;">
                <div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                  <div style="border-radius:50%;height:10px;width:10px;background-color: ${indicatorColor};"></div>
                      <span>P&L:</span>
                      <div style="color:${indicatorColor};">
                        <span>${
                          diff >= 0
                            ? "+₹" + diff.toLocaleString()
                            : "-₹" + diff * -1
                        }</span> 
                      </div>
                </div>
                <div style="display:flex; flex-direction:row; align-items:center; gap:5px; padding:5px 0px 0px 0px">
                  <div style="border-radius:50%;height:10px;width:10px;background-color: ${indicatorColor};"></div>
                      <span>Returns:</span>
                      <div style="color:${indicatorColor};">
                       <span>${returns} </span> <span style="color:${
      theme === "dark" ? "#ccc" : "#3d4753"
    }">of ₹${initialCapital.toLocaleString()}</span>
                      </div>
                </div>
            </div>`;
  };

  const apexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        height: 300,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 200,
        },
        toolbar: { show: false },
        fontFamily: "inherit",
        selection: { enabled: false },
        zoom: { enabled: false },
      },
      grid: {
        borderColor: theme === "dark" ? "#333e47" : "#e9ecee",
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        categories,

        labels: {
          show: !fullSize,
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const value = capitalSeries[dataPointIndex];
          const i = dataPointIndex;
          return `
            <div style="min-width:80px;text-align:center;">
                <div style="padding:6px;font-weight:bold;font-size:14px;text-align:center;color:${
                  theme === "dark" ? "#919eab" : "#34495e"
                };background-color:${
            theme === "dark" ? "#28323d" : "rgb(236, 240, 244)"
          }">${i === 0 ? "Initial Capital" : categories[i]}
                </div>
                <div style="padding:10px 10px 0px 10px;display:flex;align-items:center;gap:5px;font-size:14px;">
                  <div style="border-radius:50%;height:10px;width:10px;background-color: #05ab72;">
                  </div>
                  <div style=" color: ${
                    theme === "dark" ? "#fff" : "#000"
                  };font-size:14px">Capital: 
                  </div>  
                  <div style="font-weight:bolder">
                    ₹${
                      value % 1 > 0
                        ? value.toLocaleString()
                        : value.toLocaleString()
                    }
                  </div>
                  
                </div>
                ${handleGrowthChange(value, i)}
            </div>
          `;
        },

        style: {
          fontSize: "14px",
          color: "#34495e",
        },
        theme: theme === "dark" ? "dark" : "light",
        x: {
          show: true,
          style: {
            fontSize: "12px",
            fontWeight: "700",
            color: "#ddd",
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: [val2 > val1 ? "#05ab72" : "#fe5a5a"],
      },
      colors: [val2 > val1 ? "#05ab72" : "#fe5a5a"],
      markers: {
        size: 0,
        strokeWidth: 0,
        hover: { size: 4 },
      },
      legend: { show: false },
      dataLabels: {
        enabled: false,
      },
    }),
    [theme, categories, val1, val2]
  );

  const apexSeries = [
    {
      name: "Capital",
      data: capitalSeries,
    },
  ];

  return (
    <div className="capital-graph-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h3>Capital Graph From Intial Capital</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>Growth:</span>
          <span
            className={
              diff > 0
                ? `badge badge-profit ${theme}`
                : `badge badge-loss ${theme}`
            }
          >
            {`${diff > 0 ? "+" : ""}${parseFloat((diff / val1) * 100).toFixed(
              2
            )}%`}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <span>Total Capital</span>
          <Button
            styleType={"ENABLE"}
            toggleOn={isDematCapital}
            color={"#05ab72"}
            onClick={handleCapitalChange}
            bothSide={true}
          />
          <span>Demat Capital</span>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {audienceMetricsData.length > pageSize && (
            <button
              onClick={() => setFullSize((v) => !v)}
              className="show-button"
            >
              {fullSize ? "Show Paginated" : "Show All"}
            </button>
          )}

          {!fullSize && audienceMetricsData.length > pageSize && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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

      <Chart
        options={apexOptions}
        series={apexSeries}
        type="line"
        height={"410px"}
        width={"100%"}
      />
    </div>
  );
}

export default CapitalGrowthLineChart;
