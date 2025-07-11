import React, { memo, useState } from "react";
import Chart from "react-apexcharts";

const TradePieChart = memo(({ pieChartTradeData, totalTrades, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Prepare data for ApexCharts
  const series = pieChartTradeData.map((entry) => parseFloat(entry.value));
  const labels = pieChartTradeData.map((entry) => entry.name);
  const colors = pieChartTradeData.map((entry) => entry.color);

  const options = {
    chart: {
      type: "pie",
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          setHoveredIndex(config.dataPointIndex);
        },
        dataPointMouseLeave: () => {
          setHoveredIndex(null);
        },
      },
    },
    labels,
    colors,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.05,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: "bold",
              formatter: (val) => `${Math.round(val)} Trades`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "15px",
              fontWeight: 700,
              formatter: () =>
                hoveredIndex !== null
                  ? `${pieChartTradeData[hoveredIndex].value} Trades`
                  : `${totalTrades} Trades`,
              style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000",
              },
            },
          },
        },
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={220}
      width={220}
    />
  );
});

export default TradePieChart;
