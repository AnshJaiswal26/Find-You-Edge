import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useUI } from "../../context/UIContext";

export default function Sidebar({ pageActive }) {
  console.log("Sidebar...");

  const navigate = useNavigate();

  const { selectedAvatar, userName } = useUI();

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: "Icons/sidebar/dashboard.png",
      alt: "Dashboard",
      route: "/",
      key: "dashboard",
    },
    {
      label: "Get Trade Records",
      icon: "Icons/sidebar/edge.png",
      alt: "Find Your Edge",
      route: "/edge",
      key: "edge",
    },
    {
      label: "Monthly Overview",
      icon: "Icons/sidebar/report.png",
      alt: "Month Records",
      route: "/yearly-calendar",
      key: "yearlycalender",
    },
    {
      label: "Strategy Rules",
      icon: "Icons/sidebar/rules.png",
      alt: "Setup Rules",
      route: "/setup-rules",
      key: "setuprules",
    },
    {
      label: "Back-Tested Data",
      icon: "Icons/sidebar/tested.png",
      alt: "Back-Tested Data",
      route: "/backtest",
      key: "backtest",
    },
    {
      label: "Mistakes To Avoid",
      icon: "Icons/sidebar/cross.png",
      alt: "Mistakes To Avoid",
      route: "/mistakes",
      key: "mistakes",
    },
    {
      label: "Strategy Analysis",
      icon: "Icons/sidebar/strategy.png",
      alt: "Strategy Analysis",
      route: null,
      key: "strategyanalysis",
    },
    {
      label: "Risk Management",
      icon: "Icons/sidebar/risk-management.png",
      alt: "Risk Management",
      route: "/risk-management",
      key: "riskmanagement",
    },
  ];

  return (
    <div className="sidebar">
      {/* <div style={{ height: "65px" }}></div> */}
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
      <div className="sidebar-menu">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            className={
              pageActive === item.key
                ? "sidebar-menu-button active"
                : "sidebar-menu-button"
            }
            onClick={() => item.route && navigate(item.route)}
          >
            <div
              style={{
                display: "flex",
                padding: "5px",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <img className="sidebar-icons" src={item.icon} alt={item.alt} />
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
