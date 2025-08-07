import { useRiskCalculator, useCalculator, useTransaction } from "@RM/context";
import { useCallback, useMemo } from "react";

export default function useUpdater() {
  const { updateCalculator } = useCalculator();
  const { updateRiskCalculator } = useRiskCalculator();
  const { updateTransaction } = useTransaction();

  const defaultCfg = useMemo(
    () => ({
      round: true,
      flashing: true,
      duration: 150,
    }),
    []
  );

  const updateSection = useCallback(
    (name, payload, cfg) => {
      const finalCfg = { ...defaultCfg, ...cfg };
      console.groupCollapsed("%c[updateSection]", "color: #d3ff63ff;");

      if (name === "calculator") {
        console.groupCollapsed(
          "%c[updateCalculator] → [set] → [updater]",
          "color: #d3ff63ff;"
        );
        updateCalculator(name, payload, finalCfg);
        console.groupEnd();
      } else if (name === "pyramiding") {
        console.warn("Skipping update for 'pyramiding' section.");
      } else {
        console.groupCollapsed(
          "%c[updateRiskCalculator] → [set] → [updater]",
          "color: #d3ff63ff;"
        );
        updateRiskCalculator(name, payload, finalCfg);
        console.groupEnd();
      }

      console.groupEnd();
    },
    [updateCalculator, updateRiskCalculator, defaultCfg]
  );

  return { updateSection, updateTransaction };
}
