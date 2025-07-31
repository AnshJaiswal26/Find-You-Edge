import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/utilities.css";
import Dashboard from "./pages/DashBoard/Dashboard";
import Edge from "./pages/Edge/Edge";
import CustomJournal from "./pages/CustomRecords/CustomJournal";
import CustomEdge from "./pages/CustomRecords/CustomEdge";
import TradingJournal from "./pages/TradingJournal/TradingJournal";
import YearlyCalendar from "./pages/YearlyCalendar/YearlyCalendar";
import SetupRules from "./pages/SetupRules/SetupRules";
import Settings from "./pages/Settings/Settings";
import Backtest from "./pages/CustomRecords/backtest";
import Mistakes from "./pages/Mistakes/Mistakes";
import RiskManagement from "./pages/RiskManagement/RiskManagement";
import { UIContextProvider } from "./context/UIContext";
function App() {
  return (
    <UIContextProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />{" "}
        <Route path="/edge" element={<Edge />} />
        <Route path="/custom-journal" element={<CustomJournal />} />{" "}
        <Route path="/custom-edge" element={<CustomEdge />} />{" "}
        <Route path="/trading-journal" element={<TradingJournal />} />{" "}
        <Route path="/yearly-calendar" element={<YearlyCalendar />} />{" "}
        <Route path="/setup-rules" element={<SetupRules />} />{" "}
        <Route path="/backtest" element={<Backtest />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mistakes" element={<Mistakes />} />
        <Route path="/risk-management" element={<RiskManagement />} />
      </Routes>
    </UIContextProvider>
  );
}
export default App;
