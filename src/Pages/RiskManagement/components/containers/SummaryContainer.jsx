import {
  ChargesSummarySection,
  TransactionSummarySection,
} from "../sections/sections";

export function SummaryContainer() {
  console.log("SummaryContainer...");

  return (
    <div className="containers">
      <TransactionSummarySection />
      <ChargesSummarySection />
    </div>
  );
}
