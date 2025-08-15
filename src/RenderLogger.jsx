import { logCmpt } from "@RM/utils";
import React, { Profiler } from "react";

let totalDuration = 0;
const renderCountMap = new Map();

function RenderLogger({ children, id, why }) {
  const handleRender = (id, phase, actualDuration) => {
    totalDuration += actualDuration;

    const key = id + why;
    const count = renderCountMap.get(key) ?? 0;
    renderCountMap.set(key, count + 1);

    logCmpt(id, why, phase, actualDuration, count, totalDuration);
  };

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
}

export default RenderLogger;
