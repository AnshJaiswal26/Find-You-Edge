import { Button, ValidationTooltip } from "@components";
import { Container } from "@layout";
import { Input, CalculatorSection, PyramidingSection } from "@RM/components";
import { useCalculatorStore, useTooltipStore } from "@RM/context";
import { useClearLogic, useFormatterLogic } from "@RM/hooks";
import { logInfo } from "@RM/utils";

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
  const tooltip = useTooltipStore((s) => s.riskReward.ratio);
  const showNote = useTooltipStore((s) => s.showNote);

  const riskReward = useCalculatorStore((s) => s.riskReward);

  return (
    <div className="relative">
      <Input
        label="Risk/Reward"
        sectionName={"riskReward"}
        field={"ratio"}
        value={"1 : " + riskReward.ratio}
      />
      {tooltip && (
        <ValidationTooltip
          message={`To actually earn 1: ${riskReward.prevRatio} after charges, plan for a slightly wider target: around 1: ${riskReward.ratio}.`}
          position="top"
          type="info"
          isVisible={true}
          onClose={() => showNote("riskReward", "increaseRatio")}
          autoHide={false}
          showCloseButton={true}
        />
      )}
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
  // const target = useCalculatorStore((cxt) => cxt.target);
  // const stopLoss = useCalculatorStore((cxt) => cxt.stopLoss);

  return (
    <>
      <CalculatorSection sectionName={"target"} />
      <CalculatorSection sectionName={"stopLoss"} />
    </>
  );
}
