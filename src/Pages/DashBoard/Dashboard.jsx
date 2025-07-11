import React, { useContext } from "react";
import "./Dashboard.css";
import "./Dark-Dashboard.css";
import { UIContext } from "../../context/Context";
import Editor from "../../components/Editor/Editor";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatCards from "./Stat-Cards/stat-card";
import TopPieCharts from "./TopPieCharts/top-pie-charts";
import OverAllLineChart from "./Charts/overall-line-chart";
import LastWeekPerformanceLineGraph from "./Charts/last-week-performance-line-chart";
import CapitalGrowthLineChart from "./Charts/capital-growth-line-chart";
import RRPerformanceBarChart from "./Charts/rr-performance-bar-chart";
import WonLoseRateBarChart from "./Charts/win-lose-rate-line-chart";
import CumulativeProfitLineChart from "./Charts/cumulative-profit-line-chart";

function Dashboard() {
  const { theme, isSidebarOpen } = useContext(UIContext);

  const isDarkTheme = theme === "dark" ? true : false;

  return (
    <div>
      <Editor />
      <Sidebar pageActive={"dashboard"} />
      <div className="dashboard">
        <main className="main-content">
          <header className="dashboard-header">
            <div className="dashboard-heading">
              <div>
                <img
                  className="dashboard-icon"
                  src="Icons/others/analysis.png"
                  alt="Trading Analysis"
                />
              </div>
              <div style={{ paddingLeft: "10px" }} className={theme}>
                <h2>Trading Analytics Dashboard</h2>
                <p>
                  Gain insights into your trading performance with detailed
                  analytics, profit and loss tracking, and risk-reward analysis.
                </p>
              </div>
            </div>
          </header>
          <StatCards
            data={"demo"}
            theme={theme}
            isSidebarOpen={isSidebarOpen}
          />
          <TopPieCharts
            data={"demo"}
            theme={theme}
            isDarkTheme={isDarkTheme}
            isSidebarOpen={isSidebarOpen}
          />

          <div style={{ width: "100%", marginBottom: "20px" }}>
            <OverAllLineChart
              data={"demo"}
              theme={theme}
              isSidebarOpen={isSidebarOpen}
            />
          </div>

          <LastWeekPerformanceLineGraph
            data={"demo"}
            theme={theme}
            isSidebarOpen={isSidebarOpen}
          />

          <div
            className="capital-rr-graph-container"
            style={{ flexDirection: isSidebarOpen ? "column" : "row" }}
          >
            <CapitalGrowthLineChart
              data={"demo"}
              theme={theme}
              isSidebarOpen={isSidebarOpen}
            />

            <RRPerformanceBarChart
              data={"demo"}
              theme={theme}
              isSidebarOpen={isSidebarOpen}
            />
          </div>

          <div
            className="win-lose-cumulative-container"
            style={{ flexDirection: isSidebarOpen ? "column" : "row" }}
          >
            <WonLoseRateBarChart
              data={"demo"}
              theme={theme}
              isSidebarOpen={isSidebarOpen}
            />

            <CumulativeProfitLineChart
              data={"demo"}
              theme={theme}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
