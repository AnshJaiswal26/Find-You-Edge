import React, { useContext } from "react";
import { UIContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ pageActive }) {
  const navigate = useNavigate();

  const { selectedAvatar, userName } = useContext(UIContext);

  return (
    <div className="sidebar">
      <aside className="sidebar-content">
        <div style={{ height: "65px" }}></div>
        <div>
          <div className="sidebar-profile">
            <img
              src={selectedAvatar}
              alt="Profile"
              className="sidebar-profile-pic"
            />
            <h3>{userName} </h3>
          </div>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li className="sidebar-active">
              <button
                className={
                  pageActive === "dashboard"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/dashboard.png"
                        alt="Dashboard"
                      />
                    </td>
                    <td>Dashboard</td>
                  </tr>
                </table>
              </button>
            </li>
            <li>
              <button
                className={
                  pageActive === "edge"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/edge")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/edge.png"
                        alt="Find Your Edge"
                      />
                    </td>
                    <td>Get Trade Records</td>
                  </tr>
                </table>
              </button>
            </li>
            {/* <li>
              <button
                className={
                  pageActive === "tradingjournal"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/trading-journal")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/trading-analysis.png"
                        alt="Trading Journal"
                      />
                    </td>
                    <td>Trading Journal</td>
                  </tr>
                </table>
              </button>
            </li> */}
            <li>
              <button
                className={
                  pageActive === "yearlycalender"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/yearly-calendar")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/report.png"
                        alt="Month Records"
                      />
                    </td>
                    <td>Monthly Overview</td>
                  </tr>
                </table>
              </button>
            </li>
            <li>
              <button
                className={
                  pageActive === "setuprules"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/setup-rules")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/rules.png"
                        alt="Setup Rules"
                      />
                    </td>
                    <td>Strategy Rules</td>
                  </tr>
                </table>
              </button>
            </li>
            <li>
              <button
                className={
                  pageActive === "backtest"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/backtest")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/tested.png"
                        alt="Back-Tested Data"
                      />
                    </td>
                    <td>Back-Tested Data</td>
                  </tr>
                </table>
              </button>
            </li>
            <li>
              <button
                className={
                  pageActive === "mistakes"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                onClick={() => navigate("/mistakes")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/cross.png"
                        alt="Mistakes To Avoid"
                      />
                    </td>
                    <td>Mistakes To Avoid</td>
                  </tr>
                </table>
              </button>
            </li>
            <li>
              <button className="sidebar-menu-button">
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/strategy.png"
                        alt="Strategy Analysis"
                      />
                    </td>
                    <td>Strategy Analysis</td>
                  </tr>
                </table>
              </button>
            </li>
            <li>
              <button
                className={
                  pageActive === "riskmanagement"
                    ? "sidebar-menu-button active"
                    : "sidebar-menu-button"
                }
                style={{ marginBottom: "0px" }}
                onClick={() => navigate("/risk-management")}
              >
                <table>
                  <tr>
                    <td>
                      <img
                        className="sidebar-icons"
                        src="Icons/sidebar/risk-management.png"
                        alt="Risk Management"
                      />
                    </td>
                    <td>Risk Management</td>
                  </tr>
                </table>
              </button>
            </li>
            <h5 className="sidebar-custom-features">Custom Features</h5>
            <ul style={{ gap: "15px" }}>
              <li>
                <button
                  className={
                    pageActive === "customjournal"
                      ? "sidebar-menu-button active"
                      : "sidebar-menu-button"
                  }
                  onClick={() => navigate("/custom-journal")}
                >
                  <table>
                    <tr>
                      <td>
                        <img
                          className="sidebar-icons"
                          src="Icons/sidebar/trading-analysis.png"
                          alt="Adaptive journal"
                        />
                        <img
                          className="sidebar-customize-icons"
                          src="Icons/sidebar/customize.png"
                          alt="Customize"
                        />
                      </td>
                      <td>Custom Journal</td>
                    </tr>
                  </table>
                </button>
              </li>
              <li>
                <button
                  style={{ marginBottom: "-5px" }}
                  className={
                    pageActive === "customedge"
                      ? "sidebar-menu-button active"
                      : "sidebar-menu-button"
                  }
                  onClick={() => navigate("/custom-edge")}
                >
                  <table>
                    <tr>
                      <td>
                        <img
                          className="sidebar-icons"
                          src="Icons/sidebar/edge.png"
                          alt="Adaptive Edge"
                        />
                        <img
                          style={{
                            marginBottom: "-3px",
                          }}
                          className="sidebar-customize-icons"
                          src="Icons/sidebar/customize.png"
                          alt="Customize"
                        />
                      </td>
                      <td>Custom Edge</td>
                    </tr>
                  </table>
                </button>
              </li>
            </ul>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
