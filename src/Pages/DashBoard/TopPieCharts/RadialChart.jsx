import React, { useState, useMemo, memo } from "react";
import Chart from "react-apexcharts";

const RadialChart = memo(
  ({ data, totalTrades, isSidebarOpen, isDarkTheme }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const series = useMemo(
      () => data.map((item) => parseFloat(item.percentage)),
      [data]
    );
    const shadeColor = (color, percent) => {
      let num = parseInt(color.replace("#", ""), 16);
      let amt = Math.round(2.55 * percent);
      let r = (num >> 16) + amt;
      let g = ((num >> 8) & 0x00ff) + amt;
      let b = (num & 0x0000ff) + amt;
      return `#${(
        0x1000000 +
        (r < 255 ? (r < 0 ? 0 : r) : 255) * 0x10000 +
        (g < 255 ? (g < 0 ? 0 : g) : 255) * 0x100 +
        (b < 255 ? (b < 0 ? 0 : b) : 255)
      )
        .toString(16)
        .slice(1)}`;
    };

    const options = useMemo(
      () => ({
        chart: {
          type: "radialBar",
          events: {
            dataPointMouseEnter: (_, __, config) => {
              setActiveIndex(config.dataPointIndex);
            },
            dataPointMouseLeave: () => {
              setActiveIndex(null);
            },
          },
        },
        legend: {
          show: false,
          position: "bottom",
          labels: {
            colors: isDarkTheme ? "#ffffff" : "#34495e",
          },
          onItemClick: {
            toggleDataSeries: false,
          },
        },
        stroke: {
          lineCap: "round",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.7,
            gradientToColors: data.map((item) => shadeColor(item.color, 20)),
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 70, 50, 0],
          },
        },
        states: {
          hover: {
            filter: {
              type: "darken",
              value: 0.3,
            },
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "45%",
            },
            track: {
              show: true,
              strokeWidth: "50%",
              background: "inherit",
            },
            dataLabels: {
              style: {
                fontSize: "14px",
                fontWeight: "bold",
              },
              name: {
                show: true,
                fontSize: "16px",
                fontWeight: 600,
              },
              value: {
                show: true,
                fontSize: "16px",
                fontWeight: "bold",

                formatter: (val) =>
                  `${Math.round(val * totalTrades * 0.01)} trades`,
              },
              total: {
                show: true,
                label: activeIndex !== null ? data[activeIndex].name : "Total",
                fontSize: "16px",
                fontWeight: 700,
                formatter: () =>
                  activeIndex !== null
                    ? `${data[activeIndex].value} Trades`
                    : `${data.reduce(
                        (acc, item) => acc + item.value,
                        0
                      )} Trades`,
              },
            },
          },
        },
        labels: data.map((item) => item.name),
        colors: data.map((item) => item.color),
      }),
      [data, totalTrades, activeIndex, isDarkTheme]
    );

    return (
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={300}
        width={300}
      />
    );
  }
);

export default RadialChart;
