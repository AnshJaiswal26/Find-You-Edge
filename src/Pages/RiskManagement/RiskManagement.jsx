import "./RiskManagement.css";
import { PageContainer } from "@layout";
import {
  CapitalInputContainer,
  SummaryContainer,
  CalculatorAndPositionsContainer,
  Settings,
} from "@RM/components";
import { TabContextProvider, NotificationContextProvider } from "@RM/context";

function RiskManagementWithoutContext() {
  return (
    <PageContainer pageActive={"riskmanagement"}>
      <Settings />
      <div className="flex gap20 wrap">
        <div className="flex column gap20 flex-1">
          <CapitalInputContainer />
          <SummaryContainer />
        </div>
        <CalculatorAndPositionsContainer />
      </div>
    </PageContainer>
  );
}

function RiskManagement() {
  return (
    <TabContextProvider>
      <NotificationContextProvider>
        <RiskManagementWithoutContext />
      </NotificationContextProvider>
    </TabContextProvider>
  );
}

export default RiskManagement;
