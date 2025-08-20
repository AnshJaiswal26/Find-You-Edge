import { useSyncOppositeSection, useValidateAndNotify } from "@RM/hooks";
import { cleanFloat } from "@RM/utils";
import { useCallback } from "react";

export default function useValidateAndSync() {
  const validateAndNotify = useValidateAndNotify();
  const syncOppositeSection = useSyncOppositeSection();

  const validateAndSync = useCallback(
    ({ name, field, buyPrice, sellPrice, pts, qty }) => {
      const invalids = validateAndNotify({
        name,
        field,
        buyPrice: cleanFloat(buyPrice),
        sellPrice: cleanFloat(sellPrice),
      });

      const oppoSecUpdates =
        name !== "calculator" && invalids === null
          ? syncOppositeSection({ name, field, buyPrice, pts, qty })
          : {};

      return {
        ...(invalids || {}),
        ...oppoSecUpdates,
      };
    },
    [syncOppositeSection, validateAndNotify]
  );

  return validateAndSync;
}
