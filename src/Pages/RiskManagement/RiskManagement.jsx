import "./RiskManagement.css";
import { PageContainer } from "@layout";
import {
  CapitalInputContainer,
  SummaryContainer,
  CalculatorAndPositionsContainer,
  Settings,
} from "@RM/components";
import {
  SettingsContextProvider,
  TransactionContextProvider,
  NoteContextProvider,
  CalculatorContextProvider,
  RiskCalculatorContextProvider,
  TabContextProvider,
  NotificationContextProvider,
} from "@RM/context";

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
