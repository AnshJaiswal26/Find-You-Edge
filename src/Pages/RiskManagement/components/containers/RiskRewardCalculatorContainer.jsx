import { Button, ValidationTooltip } from "@components";
import { Container } from "@layout";
import { Input, CalculatorSection, PyramidingSection } from "@RM/components";
import { useRiskCalculator, useNote } from "@RM/context";
import { useClearLogic } from "@RM/hooks";

export function RiskRewardCalculatorContainer() {
  console.log("RiskRewardCalculatorContainer...");

  return (
    <Container title={"Pyramiding & Risk Management Calculator"}>
      <div className="flex justify a-flex-end">
        <RiskRewardInput />
        <ClearSectionButton />
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

function ClearSectionButton() {
  const { clearTargetAndStopLoss } = useClearLogic();

  return (
    <Button
      text="Clear All"
      color="#fe5a5a"
      onClick={clearTargetAndStopLoss}
      style={{
        padding: "5px 10px",
        fontSize: "12px",
      }}
    />
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
