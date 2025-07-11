import React from "react";
import Chart from "react-apexcharts";

function StatCards({ theme, isSidebarOpen }) {
  return (
    <>
      <div className="stats">
        <div className="stat-card">
          <img src="Icons/others/inr.png" alt="Profit & Loss" />
          <div>
            <h3>Profit & Loss</h3>
            <p>13.7K</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="badge badge-profit">+10%</span>
              <span className="of">of Total Capital</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <img
            src="Icons/others/hourglass.png"
            alt="Average Risk/Reward Ratio"
          />
          <div>
            <h3>Avg Holding Time</h3>
            <p>44s</p>
          </div>
        </div>
        <div className="stat-card">
          <img src="Icons/others/discount.png" alt="Number Of Trades" />
          <div>
            <h3>P&L Growth Rate</h3>
            <p>25%</p>
          </div>
        </div>
      </div>
      <div className="stats">
        <div className="stat-card">
          <img src="Icons/others/reward.png" alt="Average Risk/Reward Ratio" />
          <div>
            <h3>Avg Risk/Reward</h3>
            <p>1:2</p>
          </div>
        </div>
        <div className="stat-card">
          <img src="Icons/others/candlestick-chart.png" alt="Win Rate" />
          <div>
            <h3>Most Trades In</h3>
            <p>Bank Nifty</p>
          </div>
        </div>
        <div className="stat-card">
          <img src="Icons/others/growth.png" alt="Win Rate" />
          <div>
            <h3>Win Rate</h3>
            <p>63%</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatCards;
