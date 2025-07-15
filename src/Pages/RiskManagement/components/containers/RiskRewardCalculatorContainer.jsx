import Button from "../../../../components/Button/Button";
import CalculatorSection from "../sections/CalculatorSection";
import PyramidingSection from "../sections/PyramidingSection";
import InputNote from "../../../../components/InputTooltip/InputNote";
import { useClearLogic } from "../../hooks/useClearLogic";
import { useRiskCalculator, useNote } from "../../context/context";
import { useInputChange } from "../../hooks/useInputChange";
import { handleSpecialCases } from "../../utils/utils";

export function RiskRewardCalculatorContainer() {
  console.log("RiskRewardCalculatorContainer...");

  return (
    <div className="containers" style={{ borderTopLeftRadius: "0px" }}>
      <div className="header-settings">
        <div className="transaction-summary-title">
          Pyramiding & Risk Management Calculator
        </div>
      </div>

      <div className="flex justify a-flex-end">
        <RiskRewardInput />
        <ClearSectionButton />
      </div>
      <TargetAndStopLossSection />
      <PyramidingSection />
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
  const { target, stopLoss, updateRiskCalculator } = useRiskCalculator();

  return (
    <div className="flex gap20 wrap">
      {[target, stopLoss].map((section) => {
        return (
          <CalculatorSection
            key={section.name}
            section={section}
            update={updateRiskCalculator}
          />
        );
      })}
    </div>
  );
}

function RiskRewardInput() {
  const { note } = useNote();
  const { riskReward, updateRiskCalculator } = useRiskCalculator();
  const { handleChange } = useInputChange();
  return (
    <div className="risk-input-group">
      <label className="risk-label">Risk/Reward</label>

      <div className="flex">
        <input
          className="risk-rr-input-1"
          style={{ width: "35px" }}
          type="text"
          value={"1 : "}
          readOnly
        />
        <input
          className="risk-rr-input-2"
          style={{ width: "100%" }}
          type="text"
          value={riskReward.ratio}
          onChange={(e) => handleChange(riskReward, "ratio", e.target.value)}
          onBlur={(e) =>
            handleSpecialCases(
              riskReward,
              "ratio",
              e.target.value,
              true,
              updateRiskCalculator
            )
          }
          placeholder="Reward"
        />
      </div>
      <InputNote
        message={`To actually earn 1: ${riskReward.prevRatio} after charges, plan for a slightly wider target: around 1: ${riskReward.ratio}.`}
        down={true}
        show={note.riskReward.ratio}
        style={{ bottom: "-64px" }}
      />
    </div>
  );
}
