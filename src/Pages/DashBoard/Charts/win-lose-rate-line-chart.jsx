import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";

function WinLoseRateBarChart({ data, theme, isSidebarOpen }) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("daily");

  // Data for different time frames
  const dailyData = [
    { day: "Day 1", winRate: 55, lossRate: 45 },
    { day: "Day 2", winRate: 60, lossRate: 40 },
    { day: "Day 3", winRate: 70, lossRate: 30 },
    { day: "Day 4", winRate: 50, lossRate: 50 },
    { day: "Day 5", winRate: 65, lossRate: 35 },
    { day: "Day 6", winRate: 58, lossRate: 42 },
    { day: "Day 7", winRate: 62, lossRate: 38 },
  ];

  const weeklyData = [
    { week: "Week 1", winRate: 58, lossRate: 42 },
    { week: "Week 2", winRate: 65, lossRate: 35 },
    { week: "Week 3", winRate: 62, lossRate: 38 },
    { week: "Week 4", winRate: 68, lossRate: 32 },
  ];

  const monthlyData = [
    { month: "January", winRate: 60, lossRate: 40 },
    { month: "February", winRate: 64, lossRate: 36 },
    { month: "March", winRate: 58, lossRate: 42 },
    { month: "April", winRate: 66, lossRate: 34 },
    { month: "May", winRate: 70, lossRate: 30 },
    { month: "June", winRate: 72, lossRate: 28 },
  ];

  const yearlyData = [
    { year: 2020, winRate: 50, lossRate: 50 },
    { year: 2021, winRate: 55, lossRate: 45 },
    { year: 2022, winRate: 60, lossRate: 40 },
    { year: 2023, winRate: 62, lossRate: 38 },
    { year: 2024, winRate: 68, lossRate: 32 },
  ];

  const getChartData = () => {
    switch (selectedTimeFrame) {
      case "daily":
        return { graphData: dailyData, xKey: "day" };
      case "weekly":
        return { graphData: weeklyData, xKey: "week" };
      case "monthly":
        return { graphData: monthlyData, xKey: "month" };
      case "yearly":
        return { graphData: yearlyData, xKey: "year" };
      default:
        return { graphData: dailyData, xKey: "day" };
    }
  };

  const { graphData, xKey } = getChartData();

  const categories = graphData.map((item) => item[xKey]);
  const winRateSeries = graphData.map((item) => item.winRate);
  const lossRateSeries = graphData.map((item) => item.lossRate);

  const apexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        stacked: false,
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          borderRadius: 1,
          dataLabels: { position: "" },
          barHeight: "55%",
          distributed: false,
        },
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
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
        title: {
          text:
            selectedTimeFrame.charAt(0).toUpperCase() +
            selectedTimeFrame.slice(1),
          style: {
            fontSize: "14px",
            color: theme === "dark" ? "#637381" : "#919eab",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: (value) => `${value}%`,
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: (value, { seriesIndex }) =>
            `<span style="color:${
              seriesIndex === 0 ? "#05ab72" : "#fe5a5a"
            };font-weight:bolder;">${value}%</span>`,
        },
        style: {
          fontSize: "14px",
        },
        theme: "light",
        shared: true,
        intersect: false,
        followCursor: false,
      },
      colors: ["#05ab72", "#fe5a5a"],
      dataLabels: {
        enabled: false,
        style: { fontSize: "12px", fontWeight: 600 },
        formatter: (val) => `${val}%`,
      },
    }),
    [theme, categories, selectedTimeFrame, winRateSeries, lossRateSeries]
  );

  const apexSeries = [
    {
      name: "Winning Rate",
      data: winRateSeries,
    },
    {
      name: "Losing Rate",
      data: lossRateSeries,
    },
  ];

  return (
    <div className={`win-lose-rate-chart ${theme}`}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h3>Win and Loss Rate Over Time </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setSelectedTimeFrame("daily")}
            className={
              selectedTimeFrame === "daily" ? "selected" : "timeframe-button"
            }
          >
            D
          </button>
          <button
            onClick={() => setSelectedTimeFrame("weekly")}
            className={
              selectedTimeFrame === "weekly" ? "selected" : "timeframe-button"
            }
          >
            W
          </button>
          <button
            onClick={() => setSelectedTimeFrame("monthly")}
            className={
              selectedTimeFrame === "monthly" ? "selected" : "timeframe-button"
            }
          >
            M
          </button>
          <button
            onClick={() => setSelectedTimeFrame("yearly")}
            className={
              selectedTimeFrame === "yearly" ? "selected" : "timeframe-button"
            }
          >
            Y
          </button>
        </div>
      </div>
      <div className="win-lose-rate-chart-legend">
        <div
          className="legend-indicator"
          style={{ backgroundColor: "#05ab72" }}
        ></div>
        <span>Winning Rate</span>
        <div
          className="legend-indicator"
          style={{ backgroundColor: "#fe5a5a" }}
        ></div>
        <span>Losing Rate</span>
      </div>
      <Chart
        options={apexOptions}
        series={apexSeries}
        type="bar"
        height={"410px"}
        width="100%"
      />
    </div>
  );
}

export default WinLoseRateBarChart;
