import { useRiskCalculator, useCalculator, useTransaction } from "@RM/context";

export default function useUpdater() {
  const { updateCalculator } = useCalculator();
  const { updateRiskCalculator } = useRiskCalculator();
  const { updateTransaction } = useTransaction();

  const updateSection = (name, payload, cfg) => {
    if (name === "calculator") updateCalculator(name, payload, cfg.round);
    else if (name === "pyramiding");
    else updateRiskCalculator(name, payload, cfg.round);
  };

  return { updateSection, updateTransaction };
}
