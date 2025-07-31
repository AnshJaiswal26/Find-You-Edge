import { Container } from "@layout";
import {
  ChargesSummarySection,
  TransactionSummarySection,
} from "@RM/components";

export function SummaryContainer() {
  console.log("SummaryContainer...");

  return (
    <Container>
      <TransactionSummarySection />
      <ChargesSummarySection />
    </Container>
  );
}
