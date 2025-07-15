import { useCalculator } from "../../context/CalculatorContext";
import CalculatorSection from "../sections/CalculatorSection";

export function NormalCalculatorContainer() {
  console.log("NormalCalculatorContainer...");
  return (
    <div className="containers" style={{ borderTopLeftRadius: "0px" }}>
      <div className="header-settings">
        <div className="transaction-summary-title">
          Normal & Position Sizing Calculator
        </div>
      </div>
      <NormalAndPositionSizingSections />
    </div>
  );
}

function NormalAndPositionSizingSections() {
  const { calculator, updateCalculator } = useCalculator();

  return (
    <>
      <CalculatorSection section={calculator} update={updateCalculator} />
      <CalculatorSection section={calculator} update={updateCalculator} />
    </>
  );
}
