import { Container } from "@layout";
import CalculatorSection from "../sections/CalculatorSection";
import { useFormatterLogic } from "@RM/hooks";
import { Button } from "@components";
import { PositionSizingSection } from "..";

export function NormalCalculatorContainer() {
  console.log("NormalCalculatorContainer...");
  return (
    <Container
      title={"Normal & Position Sizing Calculator"}
      className="radius-top-0"
    >
      <FormatButton />
      <CalculatorSection sectionName={"calculator"} />
      <PositionSizingSection />
    </Container>
  );
}

function FormatButton() {
  const { format, mode } = useFormatterLogic();

  return (
    <Button
      text="Format"
      title={"Current Mode : " + mode}
      color="#e8bd3eff"
      onClick={format}
      style={{
        padding: "5px 10px",
        fontSize: "12px",
      }}
    />
  );
}
