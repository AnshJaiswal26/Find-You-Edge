export const getUpdatedKeys = ({ prev, updates }) => {
  console.groupCollapsed("%c[getUpdatedKeys]", "color: #d3ff63ff;");
  console.log("Previous State:", prev);
  console.log("Incoming Updates:", updates);

  const keysToUpdate = {};
  const keysToReset = {};
  const keysToFlash = Object.keys(updates).reduce((acc, key) => {
    const prevVal = String(prev[key]);
    const newVal = String(updates[key]);

    if (newVal !== prevVal) {
      acc[key] = true;
      keysToUpdate[key] = updates[key];
      keysToReset[key] = false;
    }

    return acc;
  }, {});

  console.log("Keys to Update:", keysToUpdate);
  console.groupEnd();

  return { keysToFlash, keysToUpdate, keysToReset };
};

export const getStates = ({ prev, updates, updatedToZero }) => {
  return {
    ...prev,
    ...(updates && updates),
    ...(updatedToZero && updatedToZero),
  };
};
