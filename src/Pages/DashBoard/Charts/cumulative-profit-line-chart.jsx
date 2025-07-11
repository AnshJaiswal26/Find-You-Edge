import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { Legend } from "recharts";

function CumulativeProfitLineGraph({ theme, data, isSidebarOpen }) {
  const weeklyProfitData = [
    { day: "Mon", "Daily Profit": 1500, "Cumulative Profit": 1500 },
    { day: "Tues", "Daily Profit": 2000, "Cumulative Profit": 3500 },
    { day: "Wed", "Daily Profit": -500, "Cumulative Profit": 3000 },
    { day: "Thur", "Daily Profit": 1200, "Cumulative Profit": 4200 },
    { day: "Fri", "Daily Profit": 800, "Cumulative Profit": 5000 },
    { day: "Sat", "Daily Profit": 0, "Cumulative Profit": 5000 },
    { day: "Sun", "Daily Profit": -1000, "Cumulative Profit": 4000 },
  ];

  const categories = weeklyProfitData.map((item) => item.day);
  const dailyProfitSeries = weeklyProfitData.map(
    (item) => item["Daily Profit"]
  );
  const cumulativeProfitSeries = weeklyProfitData.map(
    (item) => item["Cumulative Profit"]
  );

  const apexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
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
        tooltip: {
          fontWeight: 0,
          enabled: true,
        },

        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: Math.min(...dailyProfitSeries),
        max: Math.max(...cumulativeProfitSeries),
        labels: {
          formatter: (value) => `₹${value.toLocaleString()}`,
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value, { seriesIndex }) =>
            `<span style="color:${
              seriesIndex === 0 ? "#f8c75f" : "#05ab72"
            };font-weight:bolder;">₹${value.toLocaleString()}</span>`,
        },
        style: {
          fontSize: "13px",
          fontWeight: "0",
        },
        theme: "light",
        shared: true,
        intersect: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#f8c75f", "#05ab72"],
      markers: {
        size: 0,
        strokeWidth: 0,
        hover: { size: 6 },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
    }),
    [categories, dailyProfitSeries, cumulativeProfitSeries]
  );

  const apexSeries = [
    {
      name: "Daily Profit",
      data: dailyProfitSeries,
    },
    {
      name: "Cumulative Profit",
      data: cumulativeProfitSeries,
    },
  ];

  return (
    <div className="line-graph-cumulative-container">
      <h3>Weekly Profit Analysis</h3>

      <div className="cumulative-profit-chart-legend">
        <div
          className="legend-indicator"
          style={{ backgroundColor: "#f8c75f" }}
        ></div>
        <span>Daily Profit</span>
        <div
          className="legend-indicator"
          style={{ backgroundColor: "#05ab72" }}
        ></div>
        <span>Cumulative Profit</span>
      </div>
      <Chart
        options={apexOptions}
        series={apexSeries}
        type="line"
        height={"410px"}
        width="100%"
      />
    </div>
  );
}

export default CumulativeProfitLineGraph;
