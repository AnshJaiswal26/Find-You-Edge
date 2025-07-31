import { useMemo } from "react";
import { useSettings } from "@RM/context";
import { formatValue } from "@RM/utils";

export default function useRefiners() {
  const { calcMode, calcModeSAndT } = useSettings();

  const refine = (val) => {
    const parsed = formatValue(val, calcMode);
    // console.log("calcMode", calcMode);
    return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
  };

  const round = (val) => {
    const parsed = formatValue(val, calcModeSAndT);
    // console.log(`calcModeSAndT=${calcModeSAndT}, parsedValue=${parsed}`);
    return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
  };

  const getFormatter = (name) => {
    const formatterMap = {
      calcultor: refine,
      default: round,
    };

    return formatterMap[name] || formatterMap.default;
  };

  return useMemo(
    () => ({ refine, round, getFormatter }),
    [calcMode, calcModeSAndT]
  );
}
