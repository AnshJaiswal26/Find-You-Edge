import { useCallback } from "react";
import { ButtonSelector, Overview } from "@components";
import { fieldLabels } from "../../../../data/fieldData";
import {
  useCalculatorStore,
  useSettingsStore,
  useTooltipStore,
} from "@RM/context";
import { derivedInputPoints } from "@RM/data/settingsData";
import { generateTooltip, logResult, logStart } from "@RM/utils";

export default function DerivedModeSelector({ updateSettings }) {
  const derived = useSettingsStore((s) => s.derived);
  const showNote = useTooltipStore((s) => s.showNote);
  const derivedInput = derived.input;
  const adjust = derived.adjust;

  const label = fieldLabels[derivedInput];
  const explanationPoints = derivedInputPoints(label);

  const showTooltipForInvalids = useCallback(
    (sec, m, track) => {
      const fields = ["buyPrice", "sellPrice"];
      const m1 = m === "amount" ? adjust : m;
      const m2 = track === "adjust" ? "amount" : m;

      const updates = fields.reduce((acc, f) => {
        const isNeg = sec[f] < 0;
        if (isNeg && m1 !== f) acc[f] = generateTooltip(f, "adjust", m2);
        else if (isNeg) acc[f] = generateTooltip(f, "negative", m2);
        return acc;
      }, {});

      if (Object.keys(updates).length > 0) showNote(sec.name, updates);
    },
    [showNote, adjust]
  );

  const handleDependencyChange = useCallback(
    (mode, track) => {
      logStart("handleDependencyChange", mode);
      const sections = useCalculatorStore.getState();
      const invalids = ["calculator", "target", "stopLoss"]
        .map((sec) => sections[sec])
        .filter((sec) => sec.buyPrice < 0 || sec.sellPrice < 0);

      invalids.forEach((sec) => showTooltipForInvalids(sec, mode, track));

      updateSettings("derived", { [track]: mode });
      logResult("handleDependencyChange", "Changes Done for " + mode);
    },
    [showTooltipForInvalids, updateSettings]
  );

  return (
    <div className="settings-popup-section">
      <div>
        <ButtonSelector
          label={"Derived Input:"}
          options={["amount", "buyPrice", "sellPrice"]}
          selectedOption={derivedInput}
          onSelect={(m) => handleDependencyChange(m, "input")}
          fieldFormatter={fieldLabels}
        />
      </div>
      {derivedInput === "amount" && (
        <div className="settings-popup-label flex center gap10">
          <span className="margin-bottom-10">When Amount changes adjust:</span>
          <ButtonSelector
            options={["buyPrice", "sellPrice"]}
            selectedOption={adjust}
            onSelect={(m) => handleDependencyChange(m, "adjust")}
            size="small"
            fieldFormatter={fieldLabels}
          />
        </div>
      )}
      <Overview
        title={"📘 Derived Input Overview"}
        pointsArray={explanationPoints[derivedInput]}
      />
    </div>
  );
}
