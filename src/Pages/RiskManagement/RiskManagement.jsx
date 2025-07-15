import "./RiskManagement.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Editor from "../../components/Editor/Editor";
import Settings from "./components/popups/SettingsPopup";
import {
  CapitalInputContainer,
  SummaryContainer,
  CalculatorAndPositionsContainer,
} from "./components/containers/containers";
import {
  SettingsContextProvider,
  TransactionContextProvider,
  NoteContextProvider,
  CalculatorContextProvider,
  RiskCalculatorContextProvider,
  TabContextProvider,
  NotificationContextProvider,
} from "./context/context";

function RiskManagementWithoutContext() {
  return (
    <div>
      <Editor />
      <Sidebar pageActive={"riskmanagement"} />

      <div className="risk-management-container">
        <Settings />
        <div className="flex gap20 wrap">
          <div className="flex column gap20 flex-1">
            <CapitalInputContainer />
            <SummaryContainer />
          </div>
          <CalculatorAndPositionsContainer />
        </div>
      </div>
    </div>
  );
}

function RiskManagement() {
  return (
    <SettingsContextProvider>
      <NoteContextProvider>
        <CalculatorContextProvider>
          <RiskCalculatorContextProvider>
            <TabContextProvider>
              <NotificationContextProvider>
                <TransactionContextProvider>
                  <RiskManagementWithoutContext />
                </TransactionContextProvider>
              </NotificationContextProvider>
            </TabContextProvider>
          </RiskCalculatorContextProvider>
        </CalculatorContextProvider>
      </NoteContextProvider>
    </SettingsContextProvider>
  );
}

export default RiskManagement;
