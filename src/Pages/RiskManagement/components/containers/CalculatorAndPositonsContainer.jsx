import { PopupMessage, TabSwitcher } from "@components";
import {
  RiskRewardCalculatorContainer,
  CurrentPositionsContainer,
  NormalCalculatorContainer,
} from "@RM/components";
import { useTab, useNotification } from "@RM/context";

export function CalculatorAndPositionsContainer() {
  console.log("CalculatorAndPositionsContainer...");
  return (
    <div
      className={"tab-calculator-container"}
      style={{ flex: 1.1, minWidth: "360px", position: "relative" }}
    >
      <Messages />
      <TabContainer />
    </div>
  );
}

function Messages() {
  const { msg, showMsg } = useNotification();

  return (
    <>
      <PopupMessage
        key={`added-${msg.charges.added.id}`}
        message="Charges Added"
        type="success"
        duration={1200}
        isVisible={msg.charges.added.isVisible}
        onClose={() => showMsg("charges", "added", false)}
        showCloseButton={false}
      />
      <PopupMessage
        key={`removed-${msg.charges.removed.id}`}
        message="Charges Removed"
        type="success"
        duration={1200}
        isVisible={msg.charges.removed.isVisible}
        onClose={() => showMsg("charges", "removed", false)}
        showCloseButton={false}
      />
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
      <TabSwitcher
        tabs={tabs}
        currentTab={currentTab}
        onClick={(key) => setCurrentTab(key)}
      />
      {getSelectedCalculator(currentTab)}
    </>
  );
}
