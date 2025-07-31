import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { Button, ToggleButton } from "@components";
import "./Settings.css";

const FundAllocationChart = () => {
  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Scalping", "Swing Trading", "Investment"],
    colors: ["#a5a5a5", "#6e6e6e", "#393939"],
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  };

  const chartSeries = [40, 30, 30];

  return (
    <Chart options={chartOptions} series={chartSeries} type="pie" width="330" />
  );
};

function Settings({
  theme,
  setTheme,
  setHeaderDemat, // Setter for In Demat
  setHeaderCapital, // Setter for Capital
  setHeaderRowNumber, // Setter for row number
  setApplyHeaderValues, // Setter for applyHeaderValues
  tradesArraySize,
}) {
  const [dayProfitTarget, setDayProfitTarget] = useState("0");
  const [maxLossTolerance, setMaxLossTolerance] = useState("0");
  const [saveMessage, setSaveMessage] = useState("");
  const [riskPerTrade, setRiskPerTrade] = useState("");
  const [isPortfolioRiskEnabled, setIsPortfolioRiskEnabled] = useState(false);
  const [portfolioRiskLimit, setPortfolioRiskLimit] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const [apiMessage, setApiMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    broker: null,
    index: null,
  });
  const [viewDetails, setViewDetails] = useState({}); // New state for viewing details
  const [showVerification, setShowVerification] = useState({}); // New state for managing verification visibility
  const [isAutoCalcEnabled, setIsAutoCalcEnabled] = useState(false); // New state for automatic calculations
  const [isAutoUpdateCapitalEnabled, setIsAutoUpdateCapital] = useState(false);
  const navigate = useNavigate();

  const inDematRef = useRef(null);
  const riskManagementRef = useRef(null);
  const calculationsRef = useRef(null);
  const performanceGoalsRef = useRef(null);
  const apiIntegrationRef = useRef(null);

  const [fundAllocationIcon, setFundAllocationIcon] = useState(false);
  const [riskManagementIcon, setRiskManagementIcon] = useState(false);
  const [calculationsIcon, setCalculationsIcon] = useState(false);
  const [performanceGoalIcon, setPerformanceIcon] = useState(false);
  const [brokerIcon, setBrokerIcon] = useState(false);
  const [emailIcon, setEmainIcon] = useState(false);
  const [notificationIcon, setNotificationIcon] = useState(false);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const confirmDelete = () => {
    const updatedApiKeys = apiKeys.filter(
      (_, i) => i !== deleteConfirmation.index
    );
    setApiKeys(updatedApiKeys);
    setApiMessage(`${deleteConfirmation.broker} Disconnected.`);
    setDeleteConfirmation({ isOpen: false, broker: null, index: null });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, broker: null, index: null });
  };

  useEffect(() => {
    if (apiMessage) {
      const timer = setTimeout(() => setApiMessage(""), 4000); // Clear message after 4 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [apiMessage]);

  const brokers = [
    { name: "Zerodha Kite", logo: "Icons/broker/zerodha kite.png" },
    { name: "Upstox", logo: "Icons/broker/upstox.png" },
    { name: "Angel One", logo: "Icons/broker/angel one.png" },
    { name: "Groww", logo: "Icons/broker/groww.png" },
    { name: "Dhan", logo: "Icons/broker/dhan.png" },
  ];

  const handleSave = () => {
    setSaveMessage("");
    setTimeout(() => {
      setSaveMessage("saved successfully");
    }, 10);
    setHeaderDemat(dayProfitTarget);
    setHeaderCapital(maxLossTolerance);
    setApplyHeaderValues(true); // Call the setter function
  };

  const resetGoals = () => {
    setDayProfitTarget("");
    setMaxLossTolerance("");
  };

  const handleApiVerification = (index, apiKey) => {
    const updatedApiKeys = [...apiKeys];
    if (/^\d+$/.test(apiKey)) {
      updatedApiKeys[index].status = "error"; // Number entered
      setApiMessage(
        `${updatedApiKeys[index].broker} API Key verification failed.`
      );
    } else {
      updatedApiKeys[index].status = "verified"; // Text entered
      setApiMessage(`${updatedApiKeys[index].broker} API Key verified.`);
    }
    setApiKeys(updatedApiKeys);
  };

  return (
    <>
      <div className="settings-container">
        <div className="settings-header">
          <div className="settings-heading">
            <img
              src="Icons/others/settings.png"
              style={{ width: "30px" }}
              alt="settings"
            />
            <h3>Settings</h3>
          </div>
          <button
            className="settings-close-button"
            onClick={() => {
              navigate(-1); // Navigate to the desired route++
            }}
          >
            &times;
          </button>
        </div>
        <div className="settings-content-container">
          {/* Left Navigation Bar */}
          <div className="settings-bar">
            <button
              onClick={() => scrollToSection(inDematRef)}
              onMouseEnter={() => setFundAllocationIcon(true)}
              onMouseLeave={() => setFundAllocationIcon(false)}
            >
              <img
                src={
                  fundAllocationIcon
                    ? "Icons/others/fund-allocation.png"
                    : "Icons/others/fund-allocation2.png"
                }
                style={{ width: "20px" }}
                alt="fund-allocation"
              />
              Fund Allocation
            </button>
            <button
              onClick={() => scrollToSection(riskManagementRef)}
              onMouseEnter={() => setRiskManagementIcon(true)}
              onMouseLeave={() => setRiskManagementIcon(false)}
            >
              <img
                src={
                  riskManagementIcon
                    ? "Icons/others/risk-manage.png"
                    : "Icons/others/risk-manage2.png"
                }
                style={{ width: "20px" }}
                alt="risk-management"
              />
              Risk Management
            </button>
            <button
              onClick={() => scrollToSection(calculationsRef)}
              onMouseEnter={() => setCalculationsIcon(true)}
              onMouseLeave={() => setCalculationsIcon(false)}
            >
              <img
                src={
                  calculationsIcon
                    ? "Icons/others/calculator2.png"
                    : "Icons/others/calculator.png"
                }
                style={{ width: "20px" }}
                alt="risk-management"
              />
              Calculations
            </button>
            <button
              onClick={() => scrollToSection(performanceGoalsRef)}
              onMouseEnter={() => setPerformanceIcon(true)}
              onMouseLeave={() => setPerformanceIcon(false)}
            >
              <img
                src={
                  performanceGoalIcon
                    ? "Icons/others/targeted.png"
                    : "Icons/others/targeted2.png"
                }
                style={{ width: "20px" }}
                alt="goals"
              />
              Performance Goals
            </button>
            <button
              onClick={() => scrollToSection(apiIntegrationRef)}
              onMouseEnter={() => setBrokerIcon(true)}
              onMouseLeave={() => setBrokerIcon(false)}
            >
              <img
                src={
                  brokerIcon
                    ? "Icons/others/wifi2.png"
                    : "Icons/others/wifi.png"
                }
                style={{ width: "20px" }}
                alt="connection"
              />
              Connected Brokers
            </button>
            <button
              onMouseEnter={() => setEmainIcon(true)}
              onMouseLeave={() => setEmainIcon(false)}
            >
              <img
                src={
                  emailIcon ? "Icons/others/Email.png" : "Icons/others/mail.png"
                }
                style={{ width: "20px" }}
                alt="connection"
              />
              Get Records On Email
            </button>
            <button
              onMouseEnter={() => setNotificationIcon(true)}
              onMouseLeave={() => setNotificationIcon(false)}
            >
              <img
                src={
                  notificationIcon
                    ? "Icons/others/bell2.png"
                    : "Icons/others/bell.png"
                }
                style={{ width: "20px" }}
                alt="connection"
              />
              Manage Notifications
            </button>
          </div>
          <div className="settings-content">
            {/* In Demat and Capital Section */}
            <div ref={inDematRef} className="settings-section">
              <h4>Fund Allocation</h4>
              <div className="settings-in-demat-capital-field">
                <div className="settings-input-group">
                  <div className="settings-input-wrapper">
                    <label
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "106%",
                      }}
                    >
                      Funds in Demat Account (₹):{" "}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        Auto Update{" "}
                        {isAutoUpdateCapitalEnabled ? "Enabled" : "Disabled"}
                        <Button
                          onClick={() =>
                            setIsAutoUpdateCapital(!isAutoUpdateCapitalEnabled)
                          }
                          styleType="ENABLE"
                          toggleOn={isAutoUpdateCapitalEnabled}
                          color="#00C49F"
                        />
                      </span>
                    </label>
                    <input
                      type="text"
                      value={dayProfitTarget}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[₹,]/g, "");
                        const formattedValue = value ? `₹${value}` : "₹";
                        setDayProfitTarget(formattedValue);
                        setHeaderDemat(formattedValue);
                      }}
                      placeholder="Enter In Demat"
                    />
                  </div>
                  <div className="settings-input-wrapper">
                    <label
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "106%",
                      }}
                    >
                      Current Capital (₹):{" "}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        Auto Update{" "}
                        {isAutoUpdateCapitalEnabled ? "Enabled" : "Disabled"}
                        <ToggleButton
                          onClick={() =>
                            setIsAutoUpdateCapital(!isAutoUpdateCapitalEnabled)
                          }
                          toggleOn={isAutoUpdateCapitalEnabled}
                          color="#00C49F"
                        />
                      </span>
                    </label>

                    <input
                      type="text"
                      value={maxLossTolerance}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[₹,]/g, "");
                        const formattedValue = value ? `₹${value}` : "₹";
                        setMaxLossTolerance(formattedValue);
                        setHeaderCapital(formattedValue);
                      }}
                      placeholder="Enter Capital"
                    />
                  </div>
                  <div className="settings-input-wrapper">
                    <label>Segments :</label>
                    <select>
                      <option>Scalping</option>
                      <option>Swing-Trading</option>
                      <option>Investment</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="settings-input-wrapper">
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        gap: "20px",
                      }}
                    >
                      <label
                        style={{
                          width: "100%",
                          marginTop: "5px",
                          marginLeft: "80px",
                        }}
                      >
                        Capital in Demat Account:
                      </label>
                      <input
                        style={{
                          background: "inherit",
                          border: "none",
                          fontWeight: "bold",
                          pointerEvents: "none",
                        }}
                        type="text"
                        value={
                          parseFloat(maxLossTolerance.replace(/[₹,]/g, "")) > 0
                            ? `${(
                                (parseFloat(
                                  dayProfitTarget.replace(/[₹,]/g, "")
                                ) /
                                  parseFloat(
                                    maxLossTolerance.replace(/[₹,]/g, "")
                                  )) *
                                100
                              ).toFixed(2)}%`
                            : "0.00%"
                        }
                      />
                    </div>
                  </div>
                  <FundAllocationChart />
                </div>
              </div>
              <div ref={riskManagementRef} className="settings-button-group">
                <Button
                  text="Save"
                  onClick={handleSave}
                  styleType="SAVE"
                  color="#007bff"
                />
              </div>
              {saveMessage && (
                <ApiMessage
                  message={`In Demat and Capital ${saveMessage}`}
                  type="success"
                  timer={4}
                />
              )}
            </div>

            {/* Risk Management */}
            <div className="settings-section">
              <h4>Risk Management</h4>
              <div className="settings-input-wrapper">
                <label>Risk Per Trade (%):</label>
                <input
                  type="number"
                  value={riskPerTrade}
                  onChange={(e) => setRiskPerTrade(e.target.value)}
                  placeholder="Enter risk percentage"
                  className="header-risk-input"
                />
              </div>
              <div
                className="settings-input-wrapper"
                style={{ marginTop: "20px" }}
              >
                <div className="settings-risk-label">
                  <div>
                    <label>
                      {isPortfolioRiskEnabled ? "Turn Off" : "Turn On"} Auto
                      Kill Switch in Compatible Brokers
                    </label>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    {" "}
                    <Button
                      text={isPortfolioRiskEnabled ? "Off" : "On"}
                      onClick={() =>
                        setIsPortfolioRiskEnabled(!isPortfolioRiskEnabled)
                      }
                      styleType="ENABLE"
                      toggleOn={isPortfolioRiskEnabled}
                      color="#FFBB28"
                    />
                  </div>
                </div>
                {isPortfolioRiskEnabled && (
                  <input
                    type="number"
                    value={portfolioRiskLimit}
                    onChange={(e) => setPortfolioRiskLimit(e.target.value)}
                    placeholder="Enter max drawdown of your capital (%)"
                    className="header-risk-input"
                  />
                )}
              </div>
              <div className="settings-risk-summary">
                <p>
                  <strong>Risk Per Trade:</strong> {riskPerTrade || "Not Set"}%
                </p>
                <p>
                  <strong>Portfolio Risk Limit:</strong>{" "}
                  {isPortfolioRiskEnabled
                    ? `${portfolioRiskLimit || "Not Set"}%`
                    : "Disabled"}
                </p>
              </div>
            </div>

            {/* Automatic Calculations */}
            <div ref={calculationsRef} className="settings-section">
              <h4>Automatic Calculations</h4>
              <div className="settings-input-wrapper">
                <div className="settings-risk-label-calc">
                  <div>
                    <label>
                      {isAutoCalcEnabled ? "Disable" : "Enable"} Automatic
                      Calculations
                    </label>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <Button
                      onClick={() => setIsAutoCalcEnabled(!isAutoCalcEnabled)}
                      styleType="ENABLE"
                      toggleOn={isAutoCalcEnabled}
                      color="#0088FE"
                    />
                  </div>
                </div>
                {isAutoCalcEnabled && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div className="settings-risk-label-calc">
                      <div>
                        <label>
                          {isAutoCalcEnabled ? "Disable" : "Enable"} Capital and
                          Demat Calculations
                        </label>
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <Button
                          text={isAutoCalcEnabled ? "Off" : "On"}
                          onClick={() =>
                            setIsAutoCalcEnabled(!isAutoCalcEnabled)
                          }
                          styleType="ENABLE"
                          toggleOn={isAutoCalcEnabled}
                          color="#00C49F"
                        />
                      </div>
                    </div>
                    <div className="settings-risk-label-calc">
                      <div>
                        <label>
                          {isAutoCalcEnabled ? "Disable" : "Enable"} Buy and
                          Sell Price Calculations
                        </label>
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <Button
                          onClick={() =>
                            setIsAutoCalcEnabled(!isAutoCalcEnabled)
                          }
                          styleType="ENABLE"
                          toggleOn={isAutoCalcEnabled}
                          color="#00C49F"
                        />
                      </div>
                    </div>
                    <div className="settings-risk-label-calc">
                      <div>
                        <label>
                          {isAutoCalcEnabled ? "Disable" : "Enable"} Duration
                          Calculations
                        </label>
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <Button
                          onClick={() =>
                            setIsAutoCalcEnabled(!isAutoCalcEnabled)
                          }
                          styleType="ENABLE"
                          toggleOn={isAutoCalcEnabled}
                          color="#00C49F"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Goal Tracking */}
            <div ref={performanceGoalsRef} className="settings-section">
              <h4>Performance Goal Tracking</h4>
              <div className="settings-input-wrapper">
                <label>Day Profit Target (% or Amount):</label>
                <input
                  type="number"
                  value={dayProfitTarget}
                  onChange={(e) => setDayProfitTarget(e.target.value)}
                  placeholder="Enter profit target"
                  className="settings-goal-input"
                />
              </div>
              <div
                className="settings-input-wrapper"
                style={{ marginTop: "10px" }}
              >
                <label>Maximum Loss Tolerance Per Day (% or Amount):</label>
                <input
                  type="number"
                  value={maxLossTolerance}
                  onChange={(e) => setMaxLossTolerance(e.target.value)}
                  placeholder="Enter max loss tolerance"
                  className="settings-goal-input"
                />
              </div>
              <div className="settings-goal-summary">
                <p>
                  <strong>Day Profit Target:</strong>{" "}
                  {dayProfitTarget || "Not Set"}
                </p>
                <p>
                  <strong>Maximum Loss Tolerance:</strong>{" "}
                  {maxLossTolerance || "Not Set"}
                </p>
              </div>
              <div>
                <button
                  className="settings-reset-goals-button"
                  onClick={resetGoals}
                >
                  Reset Goals
                </button>
              </div>
            </div>

            {/* API Integration */}
            <div ref={apiIntegrationRef} className="settings-section">
              <h4>Broker Connections</h4>

              <div className="settings-broker-selection">
                {brokers.map((broker) => {
                  const brokerKey = apiKeys.find(
                    (key) => key.broker === broker.name
                  );
                  const isConnected = brokerKey?.status === "verified";

                  return (
                    <div key={broker.name} className="settings-broker-option">
                      <div className="settings-broker-header">
                        <div className="settings-broker-left">
                          <div className="settings-broker-logo">
                            <img
                              src={broker.logo}
                              alt={`${broker.name} logo`}
                            />
                          </div>
                          <div className="settings-broker-info">
                            <p className="settings-broker-name">
                              {broker.name}
                            </p>
                            <p
                              className={`settings-broker-status ${
                                isConnected ? "connected" : "not-verified"
                              }`}
                            >
                              {brokerKey
                                ? isConnected
                                  ? "Connected"
                                  : "Not Verified"
                                : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          className={`settings-broker-connect ${
                            isConnected ? "connected" : ""
                          }`}
                          onClick={() => {
                            if (isConnected) {
                              setDeleteConfirmation({
                                isOpen: true,
                                broker: broker.name,
                                index: apiKeys.findIndex(
                                  (key) => key.broker === broker.name
                                ),
                              });
                            } else if (!brokerKey) {
                              setApiKeys([
                                ...apiKeys,
                                {
                                  broker: broker.name,
                                  apiKey: "",
                                  status: null,
                                },
                              ]);
                              setShowVerification((prev) => ({
                                ...prev,
                                [broker.name]: true,
                              }));
                            }
                          }}
                        >
                          <strong>
                            {isConnected ? "Disconnect" : "Connect"}
                          </strong>
                        </button>
                      </div>
                      {apiMessage && apiMessage.includes(broker.name) && (
                        <ApiMessage
                          message={apiMessage}
                          type={
                            apiMessage.includes("failed") ? "error" : "success"
                          }
                          timer={4}
                        />
                      )}
                      {brokerKey &&
                        !isConnected &&
                        showVerification[broker.name] && (
                          <div className="settings-broker-verification">
                            <button
                              className="settings-verification-close"
                              onClick={() => {
                                setShowVerification((prev) => ({
                                  ...prev,
                                  [broker.name]: false,
                                }));
                                const updatedApiKeys = apiKeys.filter(
                                  (key) => key.broker !== broker.name
                                );
                                setApiKeys(updatedApiKeys);
                              }}
                            >
                              ×
                            </button>

                            <div className="settings-api-input-group">
                              <input
                                type="text"
                                className="settings-broker-input"
                                value={brokerKey.apiKey}
                                onChange={(e) => {
                                  const updatedApiKeys = apiKeys.map((key) =>
                                    key.broker === broker.name
                                      ? { ...key, apiKey: e.target.value }
                                      : key
                                  );
                                  setApiKeys(updatedApiKeys);
                                }}
                                placeholder={`Enter API key for ${broker.name}`}
                              />
                              <div className="settings-broker-actions">
                                <button
                                  className={`settings-verify-button ${
                                    brokerKey.status === "error" ? "error" : ""
                                  }`}
                                  onClick={() =>
                                    handleApiVerification(
                                      apiKeys.findIndex(
                                        (key) => key.broker === broker.name
                                      ),
                                      brokerKey.apiKey
                                    )
                                  }
                                >
                                  {brokerKey.status === "error"
                                    ? "Re-authenticate"
                                    : "Verify"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Only show view more and details for verified brokers */}
                      {brokerKey && isConnected && (
                        <>
                          <div
                            className={`settings-broker-details ${
                              viewDetails[broker.name] ? "visible" : ""
                            }`}
                          >
                            <p>
                              API Key:{" "}
                              <span style={{ color: "gray" }}>
                                {"XXXXXXXXXXX" + brokerKey.apiKey.slice(-4)}
                              </span>
                            </p>
                            <p>
                              Connected On:{" "}
                              <span>{new Date().toLocaleString()}</span>
                            </p>
                            <p>
                              Connection Status:{" "}
                              <span
                                style={{
                                  color: "green",
                                  background: "#cafbca",
                                  padding: "0px 5px",
                                  borderRadius: "3px",
                                }}
                              >
                                Active
                              </span>
                            </p>
                          </div>
                          <div className="settings-broker-view-more">
                            <button
                              className={`settings-view-more ${
                                viewDetails[broker.name] ? "active" : ""
                              }`}
                              onClick={() =>
                                setViewDetails((prev) => ({
                                  ...prev,
                                  [broker.name]: !prev[broker.name],
                                }))
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: "7px",
                                }}
                              >
                                <div>
                                  {viewDetails[broker.name]
                                    ? "View Less"
                                    : "View More"}{" "}
                                </div>
                                <div
                                  style={{
                                    rotate: viewDetails[broker.name]
                                      ? "-90deg"
                                      : "90deg",
                                    fontSize: "15px",
                                    marginTop: "-2px",
                                  }}
                                >
                                  &#x27A7;
                                </div>
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {deleteConfirmation.isOpen && (
          <div className="settings-modal-overlay-confirmation">
            <div className="settings-modal-confirmation">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to disconnect the{" "}
                <strong>{deleteConfirmation.broker}</strong>?
              </p>
              <div className="settings-modal-buttons">
                <Button text="Yes" onClick={confirmDelete} styleType="SAVE" />
                <Button
                  text="Cancel"
                  onClick={cancelDelete}
                  styleType="DELETE"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;
