import React from "react";

const isCheckPoint = (index, checkPoint) => {
  // Check if the index is a checkpoint

  if (checkPoint.length === 0) return -1; // If no checkpoints, return -1

  for (let i = 0; i < checkPoint.length; i++) {
    if (index === checkPoint[i].index) {
      return i; // Return the index of the checkpoint
    }
  }
  return -1; // If not a checkpoint, return -1
};

const handleCalculatePnl = (
  start,
  end,
  updatedTrades,
  checkPointDemat,
  checkPointCapital,
  checkPoint
) => {
  for (let i = start; i < end; i++) {
    const status = isCheckPoint(i, checkPoint);

    const previousDemat =
      i > 0
        ? status >= 0
          ? parseFloat(checkPoint[status].demat) || 0
          : parseFloat(updatedTrades[i - 1].demat) || 0
        : 0;
    const previousCapital =
      i > 0
        ? status >= 0
          ? parseFloat(checkPoint[status].capital) || 0
          : parseFloat(updatedTrades[i - 1].capital) || 0
        : 0;

    const currentPnl = parseFloat(updatedTrades[i].pnl) || 0;

    updatedTrades[i].demat = previousDemat + currentPnl;
    updatedTrades[i].capital = previousCapital + currentPnl;

    // Calculate P&L of Demat (%) and P&L of Capital (%)

    let firstPnl = 0;

    firstPnl =
      parseFloat(updatedTrades[0].demat) > 0
        ? parseFloat(updatedTrades[0].demat)
        : parseFloat(updatedTrades[0].demat) * -1 || 0;

    updatedTrades[i].pnlOfDemat =
      currentPnl !== 0
        ? `${currentPnl > 0 ? "+" : ""}${(
            (currentPnl /
              (checkPointDemat === 0 ? firstPnl : checkPointDemat)) *
            100
          ).toFixed(2)}%`
        : "+0.00%";

    updatedTrades[i].pnlOfCapital =
      currentPnl !== 0
        ? `${currentPnl > 0 ? "+" : ""}${(
            (currentPnl /
              (checkPointCapital === 0 ? firstPnl : checkPointCapital)) *
            100
          ).toFixed(2)}%`
        : "+0.00%";
  }
};

export const handleChange = (
  index,
  field,
  value,
  trades,
  checkPoint,
  setTrades
) => {
  const updatedTrades = [...trades];

  try {
    const updatedTrades = [...trades];

    // Check if the trade at the given index exists
    if (!updatedTrades[index]) {
      console.error("Trade not found at index:", index);
      return;
    }

    // Update the specific field
    updatedTrades[index] = {
      ...updatedTrades[index],
      [field]: value,
    };

    // Update the trades state
    setTrades(updatedTrades);
  } catch (error) {
    console.error("Error in handleChange:", error);
  }

  if (field === "pnl") {
    // Update P&L value
    const numericValue = parseFloat(value) || 0.0;
    updatedTrades[index][field] = numericValue;

    if (checkPoint?.length > 0) {
      for (let i = 0; i < checkPoint.length; i++) {
        if (index < checkPoint[i].index) {
          let checkPointDemat =
            index - 1 === -1
              ? 0
              : i - 1 === -1
              ? 0
              : checkPoint[i - 1].demat || 0;
          let checkPointCapital =
            index - 1 === -1
              ? 0
              : i - 1 === -1
              ? 0
              : checkPoint[i - 1].capital || 0;
          handleCalculatePnl(
            index,
            checkPoint[i].index,
            updatedTrades,
            checkPointDemat,
            checkPointCapital,
            checkPoint
          ); // Call the function to recalculate P&L
          break;
        } else if (
          index === checkPoint[i].index &&
          i + 1 !== checkPoint.length
        ) {
          let checkPointDemat = checkPoint[i].demat || 0;
          let checkPointCapital = checkPoint[i].capital || 0;
          handleCalculatePnl(
            index,
            checkPoint[i + 1].index,
            updatedTrades,
            checkPointDemat,
            checkPointCapital,
            checkPoint
          ); // Call the function to recalculate P&L
          break;
        } else {
          let checkPointDemat = checkPoint[i].demat || 0;
          let checkPointCapital = checkPoint[i].capital || 0;
          handleCalculatePnl(
            index,
            updatedTrades.length,
            updatedTrades,
            checkPointDemat,
            checkPointCapital,
            checkPoint
          ); // Call the function to recalculate P&L
          break;
        }
      }
    } else {
      handleCalculatePnl(
        index,
        updatedTrades.length,
        updatedTrades,
        0,
        0,
        checkPoint
      ); // Call the function to recalculate P&L
    }
  } else if (field === "demat" || field === "capital") {
    updatedTrades[index][field] = value;

    let inDemat = 0;
    let capital = 0;

    let nextCheckpoint = updatedTrades.length;

    if (checkPoint.length > 0) {
      for (let i = 0; i < checkPoint.length; i++) {
        if (index <= checkPoint[i].index) {
          if (index >= checkPoint[i].index) {
            inDemat = parseFloat(checkPoint[i].demat).toFixed(2) || 0;
            capital = parseFloat(checkPoint[i].capital).toFixed(2) || 0;
          } else {
            inDemat = parseFloat(updatedTrades[0].demat).toFixed(2) || 0;
            capital = parseFloat(updatedTrades[0].capital).toFixed(2) || 0;
          }

          nextCheckpoint =
            index === checkPoint[i].index
              ? i + 1 !== checkPoint.length
                ? checkPoint[i + 1].index
                : checkPoint[i].index
              : checkPoint[i].index;
          break;
        }
      }
    }

    // Recalculate subsequent rows dynamically for both fields
    for (let i = index + 1; i < nextCheckpoint; i++) {
      const previousDemat = parseFloat(updatedTrades[i - 1].demat) || 0;
      const previousCapital = parseFloat(updatedTrades[i - 1].capital) || 0;
      const nextPnl = parseFloat(updatedTrades[i].pnl) || 0;

      updatedTrades[i].demat = previousDemat + nextPnl;
      updatedTrades[i].capital = previousCapital + nextPnl;

      // Calculate P&L of Demat (%) and P&L of Capital (%)
      const firstPnl = parseFloat(updatedTrades[0].pnl) || 0;

      const currentPnl = parseFloat(updatedTrades[i - 1].pnl) || 0;

      updatedTrades[i - 1].pnlOfDemat =
        currentPnl !== 0
          ? `${currentPnl > 0 ? "+" : ""}${(
              (currentPnl / (inDemat === 0 ? firstPnl : inDemat)) *
              100
            ).toFixed(2)}%`
          : "+0.00%";

      updatedTrades[i - 1].pnlOfCapital =
        currentPnl !== 0
          ? `${currentPnl > 0 ? "+" : ""}${(
              (currentPnl / (capital === 0 ? firstPnl : capital)) *
              100
            ).toFixed(2)}%`
          : "+0.00%";
    }
  } else if (field === "risk") {
    const numericValue = parseFloat(value) || 0;
    updatedTrades[index][field] = numericValue;
  } else if (field === "entryTime" || field === "exitTime") {
    updatedTrades[index][field] = value;

    const entryTime = updatedTrades[index].entryTime;
    const exitTime = updatedTrades[index].exitTime;

    if (entryTime && exitTime) {
      const entry = new Date(`1970-01-01T${entryTime}`);
      const exit = new Date(`1970-01-01T${exitTime}`);
      const diff = Math.abs(exit - entry); // Difference in milliseconds

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      updatedTrades[index].duration = `${hours}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      updatedTrades[index].duration = ""; // Clear duration if times are incomplete
    }
  } else if (field === "buyPrice" || field === "sellPrice") {
    updatedTrades[index][field] = parseFloat(value) || 0; // Ensure numeric value
    const buyPrice = parseFloat(updatedTrades[index].buyPrice) || 0;
    const sellPrice = parseFloat(updatedTrades[index].sellPrice) || 0;
    const capturedPoints = sellPrice - buyPrice;
    if (capturedPoints % 1 === 0) {
      updatedTrades[index].pointsCaptured = parseInt(capturedPoints); // Correct calculation logic
    } else {
      updatedTrades[index].pointsCaptured =
        parseFloat(capturedPoints).toFixed(2); // Correct calculation logic
    }
  } else if (field === "charges") {
    // Ensure ₹ prefix for Charges
    const numericValue = parseFloat(value) || 0;
    updatedTrades[index][field] = numericValue;
  } else {
    updatedTrades[index][field] = value;
  }

  if (field === "pnl" || field === "risk") {
    const pnl = updatedTrades[index].pnl || 0;
    const risk = updatedTrades[index].risk || 0;

    if (risk !== 0) {
      let RR = pnl / risk; // Calculate R:R Ratio as P&L / Risk
      if (RR % 1 === 0 && RR > 0) {
        updatedTrades[index].rr = `1:${parseInt(RR, 10)}`; // If RR is an integer, show it as is
      } else if (RR > 0) {
        updatedTrades[index].rr = `1:${RR.toFixed(2)}`; // Format as 1:RR
      } else if (RR < 0) {
        updatedTrades[index].rr = RR.toFixed(2);
      }
    } else {
      updatedTrades[index].rr = ""; // Clear R:R Ratio if risk is zero
    }
  }

  setTrades(updatedTrades);
};
