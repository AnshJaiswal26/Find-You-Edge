import { useMemo } from "react";
import { formatValue } from "../utils/utils";
import { useSettings } from "../context/context";

export function useRefiners() {
  const { calcMode, calcModeSAndT } = useSettings();

  const refine = (val, config) => {
    const parsed = formatValue(val, calcMode, config);
    return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
  };

  const round = (val, config) => {
    const parsed = formatValue(val, calcModeSAndT, config);
    return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
  };

  const getFormatter = (name) => {
    const formatterMap = {
      calculator: refine,
      default: round,
    };
    return formatterMap[name] || formatterMap.default;
  };

  return useMemo(
    () => ({ refine, round, getFormatter }),
    [calcMode, calcModeSAndT]
  );
}
