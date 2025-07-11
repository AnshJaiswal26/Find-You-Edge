import React, { useMemo } from "react";
import Chart from "react-apexcharts";

function LastWeekPerformanceLineChart({ data, theme, isSidebarOpen }) {
  const lineChartData = [
    { day: "Mon", "P&L": -1500, NoOfTrades: 2, Profit: 0, Loss: 0 },
    { day: "Tue", "P&L": 500, NoOfTrades: 2, Profit: 0, Loss: 0 },
    { day: "Wed", "P&L": -500, NoOfTrades: 3, Profit: 0, Loss: 0 },
    { day: "Thur", "P&L": 1000, NoOfTrades: 3, Profit: 0, Loss: 0 },
    { day: "Fri", "P&L": 1000, NoOfTrades: 2, Profit: 0, Loss: 0 },
  ];
  let capital = 12000;
  let sum = 0;
  let profit = 0;
  let loss = 0;
  let totalTrades = 0;

  lineChartData.forEach((item) => {
    totalTrades += item.NoOfTrades;
    let pnlPercentage = ((item["P&L"] / capital) * 100).toFixed(2);
    item.Profit = pnlPercentage > 0 ? pnlPercentage : "-";
    item.Loss = pnlPercentage < 0 ? pnlPercentage : "-";
    profit += item["P&L"] > 0 ? item["P&L"] : 0;
    loss += item["P&L"] < 0 ? item["P&L"] : 0;
  });

  profit = (profit / capital) * 100;
  loss = (loss / capital) * 100;

  lineChartData.map((val) => (sum += val["P&L"]));

  // Prepare data for ApexCharts
  const categories = lineChartData.map((item) => item.day);
  const profitSeries = lineChartData.map((item) =>
    item["P&L"] > 0 ? item["P&L"] : 0
  );
  const lossSeries = lineChartData.map((item) =>
    item["P&L"] < 0 ? item["P&L"] : 0
  );

  const apexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 200,
        },
        toolbar: { show: false },
        fontFamily: "inherit",
        selection: { enabled: false }, // Disable area selection
        zoom: { enabled: false }, // Disable zoom selection
      },
      legend: {
        show: false,
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

        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value) =>
            `${value > 0 ? "+" : ""}${value.toLocaleString()}`,
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#637381" : "#919eab",
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value) => {
            const color =
              value === 0
                ? theme === "dark"
                  ? "#ccc"
                  : "#3d4753"
                : value > 0
                ? "#05ab72"
                : "#fe5a5a";
            return `<span style="color:${color}; font-weight:bolder;">${
              value > 0 ? "+" : ""
            }₹${value.toLocaleString()}</span>`;
          },
        },
        style: {
          fontSize: "14px",
        },
        theme: theme === "dark" ? "dark" : "light",
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.8,
          inverseColors: false,
          opacityFrom: 0.3,
          opacityTo: 0.1,
          stops: [0, 100],
          colorStops: [
            [
              { offset: 0, color: "#05ab72", opacity: 0.3 },
              { offset: 100, color: "#05ab72", opacity: 0 },
            ],
            [
              { offset: 0, color: "#fe5a5a", opacity: 0 },
              { offset: 100, color: "#fe5a5a", opacity: 0.3 },
            ],
          ],
        },
      },
      colors: ["#05ab72", "#fe5a5a"],
      markers: {
        size: 0,
        strokeWidth: 0,
        hover: { size: 6 },
      },
      dataLabels: {
        enabled: false,
      },
    }),
    [theme, categories]
  );

  const apexSeries = [
    {
      name: "Profit",
      data: profitSeries,
    },
    {
      name: "Loss",
      data: lossSeries,
    },
  ];

  return (
    <div
      className="last-week-performance-chart-and-table"
      style={{
        flexDirection: isSidebarOpen ? "column" : "row",
      }}
    >
      <div className="last-week-performance-chart">
        <div className="total-amount">
          <h3>Last Week P&L</h3>
          <div className={sum > 0 ? "badge badge-profit" : "badge badge-loss"}>
            {`${profit + loss > 0 ? "+" : ""}${parseFloat(
              profit + loss
            ).toFixed(2)}%`}
          </div>
        </div>
        <div className="last-week-performance-chart-legend">
          <div
            className="legend-indicator"
            style={{ backgroundColor: "#05ab72" }}
          ></div>
          <span>Profit</span>
          <div
            className="legend-indicator"
            style={{ backgroundColor: "#fe5a5a" }}
          ></div>
          <span>Loss</span>
        </div>
        <Chart
          options={apexOptions}
          series={apexSeries}
          height={"410px"}
          type="area"
          width={"100%"}
          style={{ padding: "0px 20px" }}
        />
      </div>
      <div className="last-week-performance-table">
        <h3>Last Week Returns Table</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="last-week-trade-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>P&L</th>
                <th>No. Of Trades</th>
                <th>Profit (%)</th>
                <th>Loss (%)</th>
              </tr>
            </thead>
            <tbody>
              {lineChartData.map((item) => {
                return (
                  <tr key={item.day}>
                    <td>{item.day}</td>
                    <td>
                      <span
                        className={`badge ${
                          item["P&L"] > 0 ? "badge-profit" : "badge-loss"
                        }`}
                      >
                        {item["P&L"] > 0 ? `+${item["P&L"]}` : item["P&L"]}
                      </span>
                    </td>
                    <td>{item.NoOfTrades}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.Profit === "-"
                            ? ""
                            : item.Profit > 0
                            ? "badge-profit"
                            : "badge-loss"
                        }`}
                      >
                        {item.Profit === "-"
                          ? "-"
                          : item.Profit > 0
                          ? `+${item.Profit}%`
                          : `${item.Profit}%`}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.Loss === "-"
                            ? ""
                            : item.Loss < 0
                            ? "badge-loss"
                            : "badge-profit"
                        }`}
                      >
                        {item.Loss === "-"
                          ? "-"
                          : item.Loss < 0
                          ? `${item.Loss}%`
                          : `+${item.Loss}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>Total</td>
                <td>
                  <span
                    className={`badge ${
                      sum > 0 ? "badge badge-profit" : "badge badge-loss"
                    }`}
                  >
                    {sum}
                  </span>
                </td>
                <td>{totalTrades}</td>
                <td>
                  <span className={"badge badge-profit"}>{`+${parseFloat(
                    profit
                  ).toFixed(2)}%`}</span>
                </td>
                <td>
                  <span className={"badge badge-loss"}>{`${parseFloat(
                    loss
                  ).toFixed(2)}%`}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default LastWeekPerformanceLineChart;
