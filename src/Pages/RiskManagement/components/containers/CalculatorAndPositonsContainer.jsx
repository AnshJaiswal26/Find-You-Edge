import { useTab, useNotification } from "../../context/context";
import {
  RiskRewardCalculatorContainer,
  CurrentPositionsContainer,
  NormalCalculatorContainer,
} from "./containers";

import Message from "../../../../components/Messages/msg";

export function CalculatorAndPositionsContainer() {
  console.log("CalculatorAndPositionsContainer...");
  return (
    <div style={{ flex: 1, minWidth: "360px", position: "relative" }}>
      <Messages />
      <TabContainer />
    </div>
  );
}

function Messages() {
  const { msg } = useNotification();

  return (
    <>
      <Message text={"Charges Added"} show={msg.charges.added} />
      <Message text={"Charges Removed"} show={msg.charges.removed} />
    </>
  );
}

function getSelectedCalculator(current) {
  switch (current) {
    case "normal":
      return <NormalCalculatorContainer />;
    case "risk-management":
      return <RiskRewardCalculatorContainer />;
    case "positions":
      return <CurrentPositionsContainer />;
    default:
      return "";
  }
}

function TabContainer() {
  const { currentTab, setCurrentTab } = useTab();

  const tabs = [
    { key: "normal", label: "Position Sizing" },
    { key: "risk-management", label: "Risk Management & Pyramiding" },
    { key: "positions", label: "Current Positions" },
  ];

  return (
    <>
      <div className="tab">
        {tabs.map(({ key, label }) => (
          <div
            key={key}
            className={`element ${currentTab === key ? "selected" : ""}`}
            onClick={() => setCurrentTab(key)}
          >
            {label}
          </div>
        ))}
      </div>
      {getSelectedCalculator(currentTab)}
    </>
  );
}
