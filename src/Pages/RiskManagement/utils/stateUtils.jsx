export const getFlashers = ({ prev, updates, reset = false }) => {
  const flashValues = Object.keys(updates).reduce((acc, key) => {
    if (!reset && (updates[key] ?? 0) !== prev[key]) acc[key] = true;
    else acc[key] = false;
    return acc;
  }, {});
  return flashValues;
};

export const getStates = ({ prev, updates, updatedToZero, flashers }) => {
  return {
    ...prev,
    ...(updates || {}),
    ...(updates?.lock && { lock: { ...prev.lock, ...updates.lock } }),
    ...(updatedToZero || {}),
    ...(flashers && {
      flash: { ...prev.flash, ...flashers },
    }),
  };
};
