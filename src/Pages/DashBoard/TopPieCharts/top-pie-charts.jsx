import React, { useMemo, useEffect } from "react";
import RadialChart from "./RadialChart";
import TradePieChart from "./TradePieChart";
import SetupBarChart from "./SetupBarChart";
import Chart from "react-apexcharts";

function TopPieCharts({ data, theme, isDarkTheme, isSidebarOpen }) {
  const pieChartTradeData = [
    {
      name: "Wins",
      value: 180,
      percentage: "45%",
      color: "#05ab72",
    },
    {
      name: "Losses",
      value: 180,
      percentage: "45%",
      color: "#fe5a5a",
    },
    {
      name: "Breakeven",
      value: 40,
      percentage: "10%",
      color: "#f8c75f",
    },
  ];

  const instrumentData = [
    { name: "Bank Nifty", percentage: "65%" },
    { name: "Nifty 50", percentage: "55%" },
    { name: "Sensex", percentage: "40%" },
  ];

  const pieChartSetupData = [
    {
      name: "Setup 1",
      value: 140,
      percentage: "35%",
      wins: 98,
      Accuracy: "70%",
      color: "#1e74ca",
    }, // blue
    {
      name: "Setup 2",
      value: 140,
      percentage: "35%",
      wins: 91,
      Accuracy: "65%",
      color: "#6e1eca",
    }, // purple
    {
      name: "Setup 3",
      value: 120,
      percentage: "30%",
      wins: 72,
      Accuracy: "60%",
      color: "#f68f2f",
    }, // orange
  ];

  const memoizedPieChartTradeData = useMemo(() => pieChartTradeData, []);
  const memoizedPieChartSetupData = useMemo(() => pieChartSetupData, []);

  const memoizedTotalTrades = useMemo(
    () => memoizedPieChartTradeData.reduce((acc, item) => acc + item.value, 0),
    [memoizedPieChartTradeData]
  );

  const winningStreakData = [1200, 1400, 1000, 900, 1200];
  const rawLosingStreakData = [-500, -470, -600];
  const losingStreakData = rawLosingStreakData.map((v) => Math.abs(v));

  const miniBarOptions = (color, isLoss = false) => ({
    chart: {
      type: "bar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 1,
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const val = series[seriesIndex][dataPointIndex];
        const displayVal = isLoss ? `-₹${val}` : `₹${val}`;
        const color = isLoss ? "#f44336" : "#4caf50";
        return `
          <div style="padding:6px;display:flex;flex-direction:row;align-items:center;gap:8px">
          <div style="background-color:${color};height:10px;width:10px;border-radius:50%"></div>
            <div style="font-size:15px;font-weight:bold;color:${
              theme === "dark" ? "#ffffff" : "#34495e"
            };">
              ${displayVal}
            </div>
          </div>
        `;
      },
      style: { fontSize: "12px" },
      marker: { show: false },
      theme: "light",
    },
    colors: [color],
    grid: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: false },
      max: isLoss
        ? Math.max(...losingStreakData) + 100
        : Math.max(...winningStreakData) + 100,
      min: 0,
    },
  });

  return (
    <div className="top-charts-section">
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <div className="total-trades-container">
          <h3>Total Trades</h3>
          <div className="pie-chart-and-percentage-bars-container">
            <div className="pie-chart-and-legend-container">
              <TradePieChart
                pieChartTradeData={memoizedPieChartTradeData}
                totalTrades={memoizedTotalTrades}
                theme={theme}
              />
              <div className="pie-chart-legend">
                {pieChartTradeData.map((entry, index) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    key={index}
                  >
                    <div
                      key={index}
                      className="legend-indicator"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span> {entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="percentage-bars-container">
              {pieChartTradeData.map((entry, index) => (
                <div key={index} className="percentage-bar">
                  <div className="bar-container">
                    <div className="bar-label">
                      <div className="bar-name">
                        <strong>{entry.name}</strong>
                      </div>
                      <div>
                        <span className="bar-value">{entry.value} Trades </span>
                        <span className="percentage">({entry.percentage})</span>
                      </div>
                    </div>

                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: entry.percentage,
                          backgroundColor: entry.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="stats"
          style={{
            flex: 1,
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <div className="stat-card">
            <div>
              <Chart
                options={miniBarOptions("#4caf50")}
                series={[{ data: winningStreakData }]}
                type="bar"
                height={50}
                width={70}
              />
            </div>
            <div>
              <h3>Winning Streak</h3>
              <p>5 Trades</p>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <Chart
                options={miniBarOptions("#f44336", true)}
                series={[{ data: losingStreakData }]}
                type="bar"
                height={50}
                width={70}
              />
            </div>
            <div>
              <h3>Losing Streak</h3>
              <p>3 Trades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="streak-and-setup-pie-chart-section">
        <div className="setup-pie-chart-section">
          <h3>Total Trades on Setups</h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <RadialChart
              data={memoizedPieChartSetupData}
              totalTrades={memoizedTotalTrades}
              isSidebarOpen={isSidebarOpen}
              isDarkTheme={isDarkTheme}
            />
          </div>
          <div className="setup-pie-chart-legend">
            {pieChartSetupData.map((entry, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  flexWrap: "wrap",
                }}
                key={index}
              >
                <div
                  key={index}
                  className="legend-indicator"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span> {entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="setup-bar-chart-section">
          <div>
            <h3>Setups Accuracy</h3>
          </div>

          <SetupBarChart
            data={memoizedPieChartSetupData}
            totalTrades={memoizedTotalTrades}
            isSidebarOpen={isSidebarOpen}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default TopPieCharts;
