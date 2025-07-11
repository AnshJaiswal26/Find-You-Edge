import React, { memo, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import "../Dashboard.css";

const SetupBarChart = memo(({ data, totalTrades, isSidebarOpen, theme }) => {
  const tradeColors = data.map((item) => item.color);
  const accuracyColors = data.map((item) =>
    item.color.length === 7 ? `${item.color}99` : item.color
  );

  const options = useMemo(
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
          speed: 200,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "60%",
          borderRadius: 3,
          distributed: false,
          dataLabels: { position: "center" },
          barHeight: "55%",
        },
      },
      grid: {
        borderColor: theme === "dark" ? "#333e47" : "#e9ecee",
        strokeDashArray: 5,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: data.map((item) => item.name),
        labels: {
          show: true,
          formatter: (value) => `${value}%`,
          style: {
            fontSize: "15px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
        max: 100,
        crosshairs: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "15px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
      },
      colors: [
        function ({ seriesIndex, dataPointIndex }) {
          if (seriesIndex === 0) return tradeColors[dataPointIndex];
          if (seriesIndex === 1) return accuracyColors[dataPointIndex];
          return "#e0e0e0";
        },
      ],
      fill: { type: "solid" },
      dataLabels: {
        enabled: true,
        style: { fontSize: "13px", fontWeight: 600 },
        formatter: (val) => `${val}%`,
        background: { enabled: false },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: { formatter: (val) => `${val}%` },
        followCursor: false,
        theme: "light",
        custom: function ({ series, dataPointIndex }) {
          const tradeVal = series[0][dataPointIndex];
          const accVal = series[1][dataPointIndex];
          const tradeColor = tradeColors[dataPointIndex];
          const accColor = accuracyColors[dataPointIndex];
          const winTrades = ((totalTrades * tradeVal) / 100) * (accVal / 100);
          return `
          <div>
            <div style="font-size:14px;font-weight:600;text-align:center;color:${
              theme === "dark" ? "#919eab" : "#34495e"
            };padding:6px;background-color:${
            theme === "dark" ? "#28323d" : "rgb(236, 240, 244)"
          };">${data[dataPointIndex].name}</div>
            <div style="display:flex;align-items:center;margin-bottom:2px;padding:6px">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${tradeColor};margin-right:3px;"></span>
              <span style="margin-left:4px">Trade Percentage: </span><b style="margin-left:4px;color:${tradeColor}">${tradeVal}%</b>
            </div>
            <div style="display:flex;align-items:center;padding:0px 6px 6px 6px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${accColor};margin-right:3px;"></span>
              <span style="margin-left:4px;">Accuracy: </span><span style="margin-left:4px;color:${tradeColor};font-weight:bold">${accVal}%</span>
              <span style="margin-left:8px;color:#888;font-size:14px;color:${tradeColor};font-weight:bold">(${winTrades} wins)</span>
            </div>
          </div>
        `;
        },
      },
      legend: { show: false },
      states: {
        hover: { filter: { type: "darken", value: 0.9 } },
        active: { filter: { type: "none" } },
      },
    }),
    [data, tradeColors, accuracyColors, totalTrades, theme, isSidebarOpen]
  );

  const series = useMemo(
    () => [
      {
        name: "Trade Percentage",
        data: data.map((item) => parseFloat(item.percentage)),
      },
      {
        name: "Accuracy",
        data: data.map((item) => parseFloat(item.Accuracy)),
      },
    ],
    [data]
  );

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 350);
  }, [isSidebarOpen]);

  return (
    <div
      style={{
        transition: "all 0.3s ease-in-out",
        width: "100%",
        height: "340px",
      }}
    >
      <Chart
        options={options}
        series={series}
        type="bar"
        height={320}
        width={"100%"}
      />
    </div>
  );
});

export default SetupBarChart;
