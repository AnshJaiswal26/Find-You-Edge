import { Container } from "@layout";
import { useCalculator } from "../../context/CalculatorContext";
import { useSettings } from "../../context/SettingsContext";
import CalculatorSection from "../sections/CalculatorSection";

export function NormalCalculatorContainer() {
  console.log("NormalCalculatorContainer...");
  return (
    <Container title={"Normal & Position Sizing Calculator"}>
      <NormalAndPositionSizingSections />
    </Container>
  );
}

function NormalAndPositionSizingSections() {
  const { calculator } = useCalculator();

  return (
    <>
      <CalculatorSection section={calculator} />
      {/* <CalculatorSection section={calculator} /> */}
    </>
  );
}
