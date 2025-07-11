import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

function OverAllLineChart({ data, theme, isSidebarOpen }) {
  const [isDayData, setIsDayData] = useState(true);

  const [audienceMetricsData, setAudienceMetricsData] = useState([
    {
      day: "",
      date: "",
      trades: 0,
      capital: 25000,
      demat: 15000,
    },
    {
      day: "Day 1",
      date: "1 Jun 2025",
      trades: 2,
      capital: 27000,
      demat: 17000,
    },
    {
      day: "Day 2",
      date: "2 Jun 2025",
      trades: 1,
      capital: 26500,
      demat: 16500,
    },
    {
      day: "Day 3",
      date: "3 Jun 2025",
      trades: 3,
      capital: 27500,
      demat: 17500,
    },
    {
      day: "Day 4",
      date: "4 Jun 2025",
      trades: 2,
      capital: 27000,
      demat: 17000,
    },
    {
      day: "Day 5",
      date: "5 Jun 2025",
      trades: 1,
      capital: 28000,
      demat: 18000,
    },
    {
      day: "Day 6",
      date: "6 Jun 2025",
      trades: 2,
      capital: 27500,
      demat: 17500,
    },
  ]);

  const [overAllData, setAudienceMetricsOverAllData] = useState([
    {
      date: "",
      trade: "",
      capital: 25000,
      demat: 15000,
      pnl: 0,
      rr: "",
    },
    {
      date: "1 Jun 2025",
      trade: "Trade-1",
      capital: 26000,
      demat: 16000,
      pnl: 1000,
      rr: "1:2",
    },
    {
      date: "1 Jun 2025",
      trade: "Trade-2",
      capital: 27000,
      demat: 17000,
      pnl: 1000,
      rr: "1:2",
    },
    {
      date: "2 Jun 2025",
      trade: "Trade-1",
      capital: 26500,
      demat: 16500,
      pnl: -500,
      rr: "-1",
    },
    {
      date: "3 Jun 2025",
      trade: "Trade-1",
      capital: 28500,
      demat: 18500,
      pnl: 2000,
      rr: "1:4",
    },
    {
      date: "3 Jun 2025",
      trade: "Trade-2",
      capital: 28000,
      demat: 18000,
      pnl: -500,
      rr: "-1",
    },

    {
      date: "3 Jun 2025",
      trade: "Trade-3",
      capital: 27500,
      demat: 17500,
      pnl: -500,
      rr: "-1",
    },
    {
      date: "4 Jun 2025",
      trade: "Trade-1",
      capital: 27000,
      demat: 17000,
      pnl: -500,
      rr: "-1",
    },
    {
      date: "4 Jun 2025",
      trade: "Trade-2",
      capital: 27000,
      demat: 17000,
      pnl: 0,
      rr: "Breakeven",
    },
    {
      date: "5 Jun 2025",
      trade: "Trade-1",
      capital: 28000,
      demat: 18000,
      pnl: 1000,
      rr: "1:2",
    },
    {
      date: "6 Jun 2025",
      trade: "Trade-1",
      capital: 27500,
      demat: 17500,
      pnl: -500,
      rr: "-1",
    },
    {
      date: "6 Jun 2025",
      trade: "Trade-2",
      capital: 27500,
      demat: 17500,
      pnl: 0,
      rr: "",
    },
  ]);

  // Pagination logic
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(
    (isDayData ? audienceMetricsData.length : overAllData.length) / pageSize
  );

  const [fullSize, setFullSize] = useState(false);
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

  const paginatedData = isDayData
    ? fullSize
      ? audienceMetricsData
      : audienceMetricsData.slice(
          page !== 0 ? page * pageSize - 1 : page * pageSize,
          page * pageSize + pageSize
        )
    : fullSize
    ? overAllData
    : overAllData.slice(
        page !== 0 ? page * pageSize - 1 : page * pageSize,
        page * pageSize + pageSize
      );

  const val1 = paginatedData[0].capital;
  const val2 = paginatedData[paginatedData.length - 1].capital;
  const diff = val2 - val1;

  const categories = paginatedData.map((item) =>
    isDayData ? item.day : item.date
  );
  const capitalSeries = paginatedData.map((item) => item.capital);
  let isFirstIndex = false;

  const handleGrowthChange = (val, index) => {
    const previousValue = index > 0 ? capitalSeries[index - 1] : null;
    isFirstIndex = index === 0 ? true : false;
    const diff = previousValue !== null ? val - previousValue : 0;
    const intialCapital = audienceMetricsData[0].capital;
    const initialDemat = audienceMetricsData[0].demat;
    const indicatorColor =
      diff === 0
        ? theme === "dark"
          ? "#ccc"
          : "#3d4753"
        : diff > 0
        ? "#05ab72"
        : "#fe5a5a";

    const formattedPercentageForCapital = parseFloat(
      (diff / intialCapital) * 100
    ).toFixed(2);

    const percentageForCapital =
      formattedPercentageForCapital % 1 === 0
        ? parseInt(formattedPercentageForCapital)
        : formattedPercentageForCapital;

    const formattedPercentageForDemat = parseFloat(
      (diff / initialDemat) * 100
    ).toFixed(2);

    const percentageForDemat =
      formattedPercentageForDemat % 1 === 0
        ? parseInt(formattedPercentageForDemat)
        : formattedPercentageForDemat;

    const returnsForCapital =
      diff >= 0
        ? "(+" + percentageForCapital + "%)"
        : "(" + percentageForCapital + "%)";

    const returnsForDemat =
      diff >= 0
        ? "(+" + percentageForDemat + "%)"
        : "(" + percentageForDemat + "%)";

    const date = isDayData
      ? audienceMetricsData[index].date
      : overAllData[index].date;
    const demat = isDayData
      ? audienceMetricsData[index].demat
      : overAllData[index].demat;
    const trades = isDayData
      ? audienceMetricsData[index].trades
      : overAllData[index].trade;
    const Gains = parseFloat(
      (isDayData
        ? (audienceMetricsData[index].capital - intialCapital) / intialCapital
        : (overAllData[index].capital - intialCapital) / intialCapital) * 100
    ).toFixed(2);

    const cumulativeGains = Gains % 1 === 0 ? parseInt(Gains) : Gains;
    return `<div style="display:flex;flex-direction:column;gap:5px">
             ${
               isDayData
                 ? `<div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                <span style="font-weight:normal">Date:</span>
                <div><span>${date}</span>
                </div>
              </div>`
                 : ``
             }
    <div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                <span style="font-weight:normal">P&L:</span>
                <div style="color:${indicatorColor}">${
      diff >= 0 ? "+₹" + diff.toLocaleString() : "-₹" + diff * -1
    }
                </div>
              </div>
    <div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                <span style="font-weight:normal">Capital:</span>
                <div><span>₹${capitalSeries[
                  index
                ].toLocaleString()}</span> <span style="color:${indicatorColor}"> ${returnsForCapital}</span>
                </div>
              </div>
              
              <div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                <span style="font-weight:normal">Demat:</span>
                <div><span>₹${demat.toLocaleString()}</span> <span style="color:${indicatorColor}"> ${returnsForDemat}</span>
                </div>
              </div>
              
              <div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                <span style="font-weight:normal">${
                  isDayData ? "Total Trades:" : "Trades:"
                }</span>
                <div>${trades}
                </div>
              </div>
              <div style="display:flex; flex-direction:row; align-items:center; gap:5px">
                <span  style="font-weight:normal">Cumulative Returns:</span>
                <div style="color:${indicatorColor}">${cumulativeGains}%
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
          return `
            <div style="min-width:80px;text-align:center;">
                <div style="padding:6px;font-weight:bold;font-size:14px;text-align:center;color:${
                  theme === "dark" ? "#919eab" : "#34495e"
                };background-color:${
            theme === "dark" ? "#28323d" : "rgb(236, 240, 244)"
          }">${
            dataPointIndex === 0
              ? "Intitial Capital"
              : categories[dataPointIndex]
          }
                </div>
                <div style="padding:10px 10px 10px 10px;display:flex;align-items:center;gap:5px;font-size:14px;">
                  <div style="font-weight:bold">
                    ${handleGrowthChange(value, dataPointIndex)}
                  </div>
                </div>
            </div>
          `;
        },

        style: {
          fontSize: "14px",
          color: "#34495e",
        },
        theme: theme === "dark" ? "dark" : "light",
        x: {
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
        colors: ["burlywood"],
      },
      colors: ["burlywood"],
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Over All Growth</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>Growth:</span>
          <span
            className={diff > 0 ? "badge badge-profit" : "badge badge-loss"}
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
            gap: 8,
          }}
        >
          <select
            style={{ width: "fit-content" }}
            onChange={(e) =>
              e.target.value === "Show by Day"
                ? setIsDayData(true)
                : setIsDayData(false)
            }
          >
            <option>Show by Day</option>
            <option>Show by Trades</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
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

export default OverAllLineChart;
