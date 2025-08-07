import { Button, ValidationTooltip } from "@components";
import { Container } from "@layout";
import { Input, CalculatorSection, PyramidingSection } from "@RM/components";
import { useRiskCalculator, useNote } from "@RM/context";
import { useClearLogic, useFormatterLogic } from "@RM/hooks";

export function RiskRewardCalculatorContainer() {
  console.log("RiskRewardCalculatorContainer...");

  return (
    <Container
      title={"Pyramiding & Risk Management Calculator"}
      className="container radius-top-0"
    >
      <div className="flex justify a-flex-end">
        <RiskRewardInput />
        <div className="flex gap10">
          <FormatButton />
          <ClearSectionButton />
        </div>
      </div>
      <TargetAndStopLossSection />
      {/* <PyramidingSection /> */}
    </Container>
  );
}

function RiskRewardInput() {
  const { note, showNote } = useNote();
  const { riskReward } = useRiskCalculator();

  return (
    <div className="risk-input-group">
      <Input
        label="Risk/Reward"
        section={riskReward}
        field="ratio"
        value={"1 : " + riskReward.ratio}
      />
      <ValidationTooltip
        message={`To actually earn 1: ${riskReward.prevRatio} after charges, plan for a slightly wider target: around 1: ${riskReward.ratio}.`}
        position="top"
        type="info"
        isVisible={note.riskReward.ratio}
        onClose={() => showNote("riskReward", "ratio", false)}
        autoHide={false}
        showCloseButton={true}
      />
    </div>
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

function ClearSectionButton() {
  const { clearTargetAndStopLoss } = useClearLogic();

  return (
    <>
      <Button
        text="Clear All"
        color="#fe5a5a"
        onClick={clearTargetAndStopLoss}
        style={{
          padding: "5px 10px",
          fontSize: "12px",
        }}
      />
    </>
  );
}

function TargetAndStopLossSection() {
  const { target, stopLoss } = useRiskCalculator();

  return (
    <>
      <CalculatorSection section={target} />
      <CalculatorSection section={stopLoss} />
    </>
  );
}
