import RenderLogger from "@Profiler";
import { useRiskManagementStore } from "@RM/stores";
import { sectionColor, sectionLabels } from "@RM/data";
import { useTradeSummary } from "@RM/hooks";
import { formatINR, safe } from "@RM/utils";

export default function TransactionSummarySection() {
  return (
    <div className="transaction-summary">
      <TransactionSummaryTitle />
      <TransactionSummaryRow />
    </div>
  );
}

function TransactionSummaryTitle() {
  const transaction = useRiskManagementStore((s) => s.currentTransaction);

  return (
    <RenderLogger id={"TransactionSummaryTitle"} why={transaction}>
      <div className="transaction-summary-title">
        Transaction Summary For{" "}
        <span className={sectionColor[transaction]}>
          {sectionLabels[transaction]}
        </span>
      </div>
    </RenderLogger>
  );
}

function TransactionSummaryRow() {
  const {
    transactionName,
    tradeVal,
    buyVal,
    sellVal,
    charges,
    grossPL,
    colorForPnl,
    netPL,
    netPLPercent,
  } = useTradeSummary();

  const transactionSummaryList = [
    { label: "Trade Value", value: tradeVal },
    { label: "Buy Value", value: buyVal },
    { label: "Sell Value", value: sellVal },
    { label: "Brokerage", value: charges.brokerage },
    { label: "Other Charges", value: charges.others },
    { label: "Total Charges", value: charges.total },
    { label: "Gross P&L", value: grossPL, style: colorForPnl },
    { label: "Net P&L", value: netPL, style: colorForPnl },
    {
      label: "Net P&L (%)",
      value: netPLPercent,
      style: colorForPnl,
    },
  ];

  return (
    <RenderLogger id={"TransactionSummaryRow"} why={transactionName}>
      <div className="transaction-summary-row">
        {transactionSummaryList.map((item, idx) => (
          <div className="transaction-summary-col" key={idx}>
            <span className="transaction-summary-label">{item.label}</span>
            <div className={`transaction-summary-value ${item.style}`}>
              {item.label === "Net P&L (%)"
                ? safe(item.value, 2) + "%"
                : formatINR(item.value || 0)}
            </div>
          </div>
        ))}
      </div>
    </RenderLogger>
  );
}
