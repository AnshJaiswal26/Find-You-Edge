import React from "react";
import { useState } from "react";
import "../../pages/TradingJournal/TradingJournal.css";

function Summary({ trades }) {
  // Add these state variables after other useState declarations
  const [showOriginalValues, setShowOriginalValues] = useState({
    loss: false,
    profit: false,
    total: false,
    demat: false,
    capital: false,
    charge: false,
  });
  // Add this function before the return statement
  const toggleOriginalValue = (field) => {
    setShowOriginalValues((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const calculateSummary = () => {
    let loss = 0;
    let profit = 0;
    let charge = 0;

    trades.forEach((trade) => {
      const pnlValue = parseFloat(trade.pnl) || 0;
      const chargesValue = parseFloat(trade.charges) || 0;

      if (pnlValue < 0) {
        loss += pnlValue;
      } else {
        profit += pnlValue;
      }
      charge += chargesValue; // Add charges to the total
    });

    return {
      loss: loss,
      profit: profit,
      charge: charge,
      total: profit + loss, // Total P&L after charges
    };
  };

  const { loss, profit, charge, total } = calculateSummary();

  const noRounding = (amount, zeros) => {
    return parseFloat(Math.trunc((amount / zeros) * 10) / 10).toFixed(1);
  };

  const formatAmountToDisplay = (amount) => {
    if (amount === undefined || amount === null) {
      return "";
    }
    let parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return amount;
    }

    if (parsedAmount >= 1e19) {
      return "can not be displayed";
    } else if (parsedAmount >= 1e18 || parsedAmount <= -1e18) {
      return "₹" + noRounding(parsedAmount, 1e18) + "Q";
    } else if (parsedAmount >= 1e15 || parsedAmount <= -1e15) {
      return "₹" + noRounding(parsedAmount, 1e15) + "P";
    } else if (parsedAmount >= 1e12 || parsedAmount <= -1e12) {
      return "₹" + noRounding(parsedAmount, 1e12) + "T";
    } else if (parsedAmount >= 1e9 || parsedAmount <= -1e9) {
      return "₹" + noRounding(parsedAmount, 1e9) + "B";
    } else if (parsedAmount >= 1e7 || parsedAmount <= -1e7) {
      return "₹" + noRounding(parsedAmount, 1e7) + "Cr";
    } else if (parsedAmount >= 1e6 || parsedAmount <= -1e6) {
      return "₹" + noRounding(parsedAmount, 1e6) + "M";
    } else if (parsedAmount >= 1e5 || parsedAmount <= -1e5) {
      return "₹" + noRounding(parsedAmount, 1e5) + "L";
    } else if (parsedAmount >= 1e3 || parsedAmount <= -1e3) {
      return "₹" + noRounding(parsedAmount, 1000) + "K";
    }

    return parsedAmount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ceil: false,
      floor: false,
    });
  };

  return (
    <div className="trade-journal-summary">
      <div className="trade-journal-summary-item">
        <strong>Total Trades</strong>{" "}
        <span>{trades.length > 0 ? trades.length : "0"}</span>
      </div>
      <div
        className={
          loss > 1e19 ? "trade-journal-bigger-value" : "trade-journal-negative"
        }
      >
        <strong>Loss</strong>{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {showOriginalValues.loss
            ? loss.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            : formatAmountToDisplay(loss)}
          <img
            src="Icons/others/exchange.png"
            alt="toggle view"
            className="exchange-icon"
            onClick={() => toggleOriginalValue("loss")}
          />
        </div>
      </div>
      <div className="trade-journal-positive">
        <strong>Profit</strong>{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {showOriginalValues.profit
            ? profit.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            : formatAmountToDisplay(profit)}
          <img
            className="exchange-icon"
            src="Icons/others/exchange.png"
            alt="toggle view"
            onClick={() => toggleOriginalValue("profit")}
          />
        </div>
      </div>
      <div className="trade-journal-charges">
        <strong>Charges</strong>{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {showOriginalValues.charge
            ? charge.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            : formatAmountToDisplay(charge)}
          <img
            src="Icons/others/exchange.png"
            alt="toggle view"
            className="exchange-icon"
            onClick={() => toggleOriginalValue("charge")}
          />
        </div>
      </div>
      <div
        className={
          total > 1e19
            ? "trade-journal-bigger-value"
            : total === 0
            ? "trade-journal-total"
            : total > 0
            ? "trade-journal-positive"
            : "trade-journal-negative"
        }
      >
        <strong>Total</strong>{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {showOriginalValues.total
            ? total.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            : formatAmountToDisplay(total)}
          <img
            src="Icons/others/exchange.png"
            alt="toggle view"
            className="exchange-icon"
            onClick={() => toggleOriginalValue("total")}
          />
        </div>
      </div>
      <div className="trade-journal-summary-item">
        <strong>In Demat Account</strong>{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {trades.length > 0
            ? showOriginalValues.demat
              ? trades[trades.length - 1].demat.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })
              : formatAmountToDisplay(trades[trades.length - 1].demat)
            : "₹0"}
          <img
            src="Icons/others/exchange.png"
            alt="toggle view"
            className="exchange-icon"
            onClick={() => toggleOriginalValue("demat")}
          />
        </div>
      </div>
      <div className="trade-journal-summary-item">
        <strong>Capital</strong>{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {trades.length > 0
            ? showOriginalValues.capital
              ? trades[trades.length - 1].capital.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })
              : formatAmountToDisplay(trades[trades.length - 1].capital)
            : "₹0"}
          <img
            src="Icons/others/exchange.png"
            alt="toggle view"
            className="exchange-icon"
            onClick={() => toggleOriginalValue("capital")}
          />
        </div>
      </div>
    </div>
  );
}

export default Summary;
