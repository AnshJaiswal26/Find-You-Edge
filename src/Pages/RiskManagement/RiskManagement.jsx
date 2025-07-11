import React, { useState, useRef } from "react";
import { UIContext } from "../../context/Context";
import "./RiskManagement.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Editor from "../../components/Editor/Editor";
import InputNote from "../../components/InputTooltip/InputNote";
import Message from "../../components/Messages/msg";
import Button from "../../components/Button/Button";
import {
  handleChange,
  handleSpecialCases,
  calculateAllCharges,
  formatINR,
  formatValue,
  getNewCharges,
} from "./calculators/function";
import { clearAll } from "./calculators/sections";
import CalculationsSection from "./calculators/sections";
import PyramidingSection from "./calculators/pyramiding-section";

const RiskManagement = () => {
  const [showSettings, setShowSettings] = useState(false);

  const [msg, setMessage] = useState({
    charges: {
      added: false,
      removed: false,
    },
  });

  const [currentSection, setCurrentSection] = useState({
    name: "Calculator",
    color: "",
  });

  const [calcMode, setCalcMode] = useState("approx");
  const [calcModeSAndT, setCalcModeSAndT] = useState("market");
  const [currentCalc, setCurrentCalc] = useState("normal");

  const [showNote, setShowNote] = useState({
    other: {
      rr: false,
      capital: false,
    },
    calculator: {
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
    },
    target: {
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
      greater: false,
    },
    stopLoss: {
      buyPrice: false,
      sellPrice: false,
      qty: false,
      pts: false,
      amount: false,
      percent: false,
      less: false,
    },
    pyramiding: {
      achieved: false,
    },
  });

  const [other, setOther] = useState({
    name: "other",
    capital: 0,
    rr: 0,
    prevRR: 0,
    prevVal: 0,
  });

  const [transaction, setTransaction] = useState({
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
  });

  const [calculator, setcalculator] = useState({
    name: "calculator",
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "neutral",
    labels: ["Captured (Pts)", "Net P&L (₹)", "Net P&L (%)"],
    prevVal: 0,
  });

  const [target, setTarget] = useState({
    name: "target",
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "green",
    labels: ["Target (Pts)", "Target (₹)", "Target (%)"],
    prevVal: 0,
  });

  const [stopLoss, setStopLoss] = useState({
    name: "stopLoss",
    buyPrice: 0,
    sellPrice: 0,
    qty: 0,
    pts: 0,
    amount: 0,
    percent: 0,
    color: "red",
    labels: ["SL (Pts)", "SL (₹)", "SL (%)"],
    prevVal: 0,
  });

  const [pyramiding, setPyramiding] = useState({
    name: "pyramiding",
    currentLayer: 0,
    riskIncrement: "Fix",
    at: "priceAchieved",
    table: {
      headers: [
        "Layer",
        "Entry Price",
        "Qty",
        "Risk/Reward",
        "Risk (%) Per Layer",
        "Cumulative Risk",
        "Risk (₹) Per Layer",
        "Avg Buy Price",
      ],
      rows: [
        {
          layer: 1,
          priceAchieved: 0,
          addQty: 0,
          rrAchieved: 0,
          riskPerLayer: 0,
          cummulativeRisk: 0,
          riskAmount: 0,
          avgBuyPrice: 0,
        },
      ],
    },
    prevVal: 0,
  });

  const setterMap = {
    msg: setMessage,
    showNote: setShowNote,
    section: setCurrentSection,
    other: setOther,
    calculator: setcalculator,
    target: setTarget,
    stopLoss: setStopLoss,
    transaction: setTransaction,
    pyramiding: setPyramiding,
  };

  const getterMap = {
    other: other,
    calculator: calculator,
    target: target,
    stopLoss: stopLoss,
    transaction: transaction,
    pyramiding: pyramiding,
  };

  function update(section, updates) {
    if (updates === 0) {
      const updatedToZero = {};
      setterMap[section]((prev) => {
        const keys = [
          "buyPrice",
          "sellPrice",
          "qty",
          "pts",
          "amount",
          "percent",
        ];
        keys.forEach((key) => {
          updatedToZero[key] = 0;
        });
        return { ...prev, ...updatedToZero };
      });
      return;
    }
    setterMap[section]((prev) => {
      return { ...prev, ...updates };
    });
  }

  const timeOutRefs = useRef({});
  function timeOut(section, field, duration = 3000, isVisible) {
    const key = `${section}_${field}`;
    if (timeOutRefs.current[key] && duration !== 0) return;

    if (!showNote[section][field] && !isVisible && duration === 0) return;
    const show = (prop) => {
      update("showNote", {
        [section]: {
          ...showNote[section],
          [field]: prop,
        },
      });
    };

    if (duration === 0) {
      show(isVisible);
      return;
    }
    show(true);
    timeOutRefs.current[key] = setTimeout(() => {
      show(false);
      delete timeOutRefs.current[key];
    }, duration);
  }

  const showMsgRefs = useRef({});
  function showMsg(section, field, duration = 600) {
    const key = `${section}_${field}`;
    if (showMsgRefs.current[key]) return;

    const show = (prop) =>
      update("msg", {
        [section]: {
          ...msg[section],
          [field]: prop,
        },
      });

    show(true);
    showMsgRefs.current[key] = setTimeout(() => {
      show(false);
      delete showMsgRefs.current[key];
    }, duration);
  }

  const refine = (val, config) => {
    const parsed = formatValue(val, calcMode, config);
    // console.log("refinedVal:", parsed);
    return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
  };

  const round = (val, config) => {
    const parsed = formatValue(val, calcModeSAndT, config);
    // console.log("roundedVal:", parsed);
    return Number.isInteger(parsed) ? parseInt(parsed) : parsed;
  };

  const qty = transaction.qty;
  const buyVal = refine(transaction.buyPrice * qty);
  const sellVal = refine(transaction.sellPrice * qty);
  const tradeVal = refine(buyVal + sellVal);
  const grossPL = refine(sellVal - buyVal);

  const getCharges = (field) => {
    return buyVal === 0 && sellVal === 0
      ? 0
      : calculateAllCharges(field, qty, buyVal, sellVal, tradeVal);
  };

  const brokerage = getCharges("brokerage");
  const eTCharges = getCharges("exchangeTransactionCharges");
  const dpCharges = getCharges("dpCharges");
  const stt = getCharges("stt");
  const sebiCharges = getCharges("sebiCharges");
  const ipft = getCharges("ipft");
  const stampDuty = getCharges("stampDuty");
  const gst = getCharges("gst");
  const otherCharges = getCharges("otherCharges");
  const totalCharges = getCharges("totalCharges");
  const netPL = refine(grossPL - totalCharges, 0);
  const netPLPercent = refine((netPL / buyVal) * 100, 0);
  const pointsToBreakeven = refine(totalCharges / qty, 0);

  const colorForPnl = netPL === 0 ? "neutral" : grossPL > 0 ? "green" : "red";

  const transactionSummaryList = [
    { label: "Trade Value", value: tradeVal },
    { label: "Buy Value", value: buyVal },
    { label: "Sell Value", value: sellVal },
    { label: "Brokerage", value: brokerage },
    { label: "Other Charges", value: otherCharges },
    { label: "Total Charges", value: totalCharges },
    { label: "Gross P&L", value: grossPL, style: colorForPnl },
    { label: "Net P&L", value: netPL, style: colorForPnl },
    {
      label: "Net P&L (%)",
      value: netPLPercent,
      style: colorForPnl,
    },
  ];

  const chargesSummaryList = [
    { label: "Turnover", value: Math.ceil(tradeVal) },
    { label: "Brokerage", value: brokerage },
    { label: "Exchange Transaction Charges", value: eTCharges },
    { label: "DP Charges", value: dpCharges },
    { label: "Securities Transaction Tax STT", value: stt },
    { label: "SEBI Turnover Charges", value: sebiCharges },
    { label: "Investor Protection Fund Trust IPFT", value: ipft },
    { label: "Stamp Duty", value: stampDuty },
    { label: "GST", value: gst },
    { label: "Total Tax & Charges", value: totalCharges },
    {
      label: "Points to Breakeven (No Profit No Loss)",
      value: "+" + pointsToBreakeven,
    },
  ];

  const getFormatter = (section) =>
    section.name === "calculator" ? refine : round;

  const toggleCharges = (section, field) => {
    const { sellPrice, pts, amount, percent } = section;

    const isAdd = field === "added";

    showMsg("charges", field);

    const formatter = getFormatter(section);

    const baseCharges = getNewCharges(section, 0);
    const adjustCharges = isAdd
      ? getNewCharges(section, baseCharges)
      : baseCharges;
    const newCharges = formatter(isAdd ? adjustCharges : -adjustCharges);

    const changeInPts = formatter(newCharges / section.qty);
    const changeInPercent = formatter((newCharges / other.capital) * 100, 0);

    const updated = {
      sellPrice: formatter(sellPrice + changeInPts),
      pts: formatter(pts + changeInPts),
      amount: formatter(amount + newCharges),
      percent: other.capital ? formatter(percent + changeInPercent, 0) : 0,
    };

    update(section.name, updated);

    const name = currentSection.name;

    if (section.name.includes(name.slice(-4)))
      update("transaction", {
        buyPrice: section.buyPrice,
        sellPrice: updated.sellPrice,
        qty: section.qty,
      });

    return updated.amount;
  };

  const charges = (field) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    let targetAmt = 0;
    let slAmt = 0;

    [target, stopLoss, calculator].forEach((section) => {
      let amount = 0;
      if (section.qty !== 0) amount = toggleCharges(section, field);
      if (section.name === "target") targetAmt = amount;
      if (section.name === "stopLoss") slAmt = amount;
    });

    if (currentSection.name !== "Calculator") {
      update("other", { rr: round(targetAmt / -slAmt, 0), prevRR: other.rr });
      if (field === "added") timeOut("other", "rr", 7000);
      else timeOut("other", "rr", 0, false);
    }

    setTimeout(() => (isProcessing.current = false), 600);
  };

  const callHandleChange = (section, field, val) => {
    const context = {
      section,
      field,
      val,
      update,
      getterMap,
      timeOut,
      refine,
      round,
    };
    handleChange(context);
  };

  const clearBothSection = () => {
    clearAll(target, isClearedRef, showNote, update);
    clearAll(stopLoss, isClearedRef, showNote, update);
  };

  const isProcessing = useRef(false);
  const isClearedRef = useRef({});

  function getSelectedCalculator(current) {
    switch (current) {
      case "normal":
        return (
          <div className="containers" style={{ borderTopLeftRadius: "0px" }}>
            <div className="header-settings">
              <div className="transaction-summary-title">
                Normal & Position Sizing Calculator
              </div>
            </div>
            <CalculationsSection
              section={calculator}
              showNote={showNote}
              currentSection={currentSection}
              handleChange={callHandleChange}
              update={update}
              isCleared={isClearedRef}
            />
            <CalculationsSection
              section={calculator}
              showNote={showNote}
              currentSection={currentSection}
              handleChange={callHandleChange}
              update={update}
              isCleared={isClearedRef}
            />
          </div>
        );
      case "risk-management":
        return (
          <div className="containers" style={{ borderTopLeftRadius: "0px" }}>
            <div className="header-settings">
              <div className="transaction-summary-title">
                Pyramiding & Risk Management Calculator
              </div>
            </div>

            <div className="flex justify a-flex-end">
              <div className="risk-input-group">
                <label className="risk-label">Risk/Reward</label>

                <div className="flex">
                  <input
                    className="risk-rr-input-1"
                    style={{ width: "35px" }}
                    type="text"
                    value={"1 : "}
                    readOnly
                  />
                  <input
                    className="risk-rr-input-2"
                    style={{ width: "100%" }}
                    type="text"
                    value={other.rr}
                    onChange={(e) =>
                      callHandleChange(other, "rr", e.target.value)
                    }
                    onBlur={(e) =>
                      handleSpecialCases(
                        other,
                        "rr",
                        e.target.value,
                        true,
                        update
                      )
                    }
                    placeholder="Reward"
                  />
                </div>
                <InputNote
                  message={`To actually earn 1: ${other.prevRR} after charges, plan for a slightly wider target: around 1: ${other.rr}.`}
                  down={true}
                  show={showNote.other.rr}
                  style={{ bottom: "-64px" }}
                />
              </div>
              <Button
                text="Clear All"
                color="#fe5a5a"
                onClick={clearBothSection}
                style={{
                  padding: "5px 10px",
                  fontSize: "12px",
                }}
              />
            </div>

            <div className="flex gap20">
              {[target, stopLoss].map((section) => {
                return (
                  <CalculationsSection
                    section={section}
                    showNote={showNote}
                    currentSection={currentSection}
                    handleChange={callHandleChange}
                    update={update}
                    isCleared={isClearedRef}
                  />
                );
              })}
            </div>

            <PyramidingSection
              section={pyramiding}
              showNote={showNote}
              handleChange={callHandleChange}
              update={update}
              getterMap={getterMap}
            />
          </div>
        );
      case "positions":
        return (
          <div
            className="containers center"
            style={{ borderTopLeftRadius: "0px", color: "grey" }}
          >
            {/* No Current Positions */}
            <BankNiftyOptions
              update={update}
              setCurrentCalc={setCurrentCalc}
              clearAll={clearBothSection}
              formatter={round}
            />
          </div>
        );
      default:
        return "";
    }
  }

  return (
    <div>
      <Editor />
      <Sidebar pageActive={"riskmanagement"} />

      <div className="risk-management-container">
        {showSettings && (
          <div className="settings-popup-overlay">
            <div className="settings-popup">
              <div className="settings-popup-header">
                <h3>Settings</h3>
                <button
                  className="close-popup"
                  onClick={() => setShowSettings(false)}
                >
                  &times;
                </button>
              </div>
              <div className="settings-content">
                <div className="risk-calc-mode">
                  <h3>Calculators Accuracy</h3>
                  <div className="risk-calc-mode-row">
                    <span className="risk-label-settings">
                      Normal Calculator:
                    </span>
                    <select
                      value={calcMode}
                      onChange={(e) => setCalcMode(e.target.value)}
                    >
                      <option value="approx">Aprox</option>
                      <option value="precise">Precise</option>
                      <option value="buffer">Buffer (Good for Slipage)</option>
                      <option value="market">Market (Recommended)</option>
                    </select>
                  </div>
                  <div className="risk-calc-mode-row">
                    <span className="risk-label-settings">
                      Risk/Reward Calculator:
                    </span>
                    <select
                      value={calcModeSAndT}
                      onChange={(e) => {
                        setCalcModeSAndT(e.target.value);
                      }}
                    >
                      <option value="market">Market (Recommended)</option>
                      <option value="buffer">Buffer (Good for Slipage)</option>
                    </select>
                  </div>
                </div>
                <div className="risk-calc-mode">
                  <h3>Pyramiding </h3>
                  <div className="risk-calc-mode-row">
                    <span className="risk-label-settings">
                      Risk Increment Mode:
                    </span>
                    <select>
                      <option>Fix</option>
                      <option>Cumulative</option>
                    </select>
                  </div>
                  <div className="risk-calc-mode-row">
                    <span className="risk-label-settings">
                      Risk/Reward Calculator:
                    </span>
                    <select>
                      <option>Market (Recommended)</option>
                      <option>Buffer (Good for Slipage)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap20 wrap">
          <div style={{ flex: 1, minWidth: "360px", position: "relative" }}>
            <Message text={"Charges Added"} show={msg.charges.added} />
            <Message text={"Charges Removed"} show={msg.charges.removed} />
            <div className="tab">
              <div
                className={`element ${
                  currentCalc === "normal" ? "selected" : ""
                }`}
                onClick={() => setCurrentCalc("normal")}
              >
                Position Sizing
              </div>
              <div
                className={`element ${
                  currentCalc === "risk-management" ? "selected" : ""
                }`}
                onClick={() => setCurrentCalc("risk-management")}
              >
                Risk Management & Pyramiding
              </div>
              <div
                className={`element ${
                  currentCalc === "positions" ? "selected" : ""
                }`}
                onClick={() => setCurrentCalc("positions")}
              >
                Current Positions
              </div>
            </div>
            {getSelectedCalculator(currentCalc)}
          </div>

          <div className="flex column gap20 flex-1">
            <div className="containers">
              <div className="flex justify wrap">
                <div className="flex baseline gap10 relative">
                  <label className="risk-label fs20">Capital</label>
                  <input
                    className="risk-input"
                    type="text"
                    value={other.capital}
                    onChange={(e) => {
                      callHandleChange(other, "capital", e.target.value);
                    }}
                    onBlur={(e) => {
                      handleSpecialCases(other, "capital", e.target.value);
                    }}
                    placeholder="₹"
                    min={0}
                  />
                  <InputNote
                    message="Enter Capital to calculate returns in %"
                    down={true}
                    show={showNote.other.capital}
                    style={{ bottom: "-50px" }}
                  />
                </div>
                <button
                  className="settings-icon-btn"
                  onClick={() => setShowSettings(true)}
                >
                  <img
                    style={{
                      width: "20px",
                      height: "20px",
                      filter: "invert(1)",
                    }}
                    src="Icons/others/adjust.png"
                    alt="Settings Icon"
                  />
                </button>
              </div>
            </div>
            <div className="containers">
              <div className="transaction-summary">
                <div className="transaction-summary-title">
                  Transaction Summary For
                  <span className={currentSection.color}>
                    {" "}
                    {currentSection.name}
                  </span>
                </div>
                <div className="transaction-summary-row">
                  {transactionSummaryList.map((item, idx) => (
                    <div className="transaction-summary-col" key={idx}>
                      <span className="transaction-summary-label">
                        {item.label}
                      </span>
                      <div
                        className={`transaction-summary-value ${item.style}`}
                      >
                        {item.label === "Net P&L (%)"
                          ? item.value + " %"
                          : formatINR(item.value || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="charges-summary">
                <div className="flex justify wrap">
                  <div className="transaction-summary-title">
                    Charges Summary
                  </div>
                  <div className="flex gap10">
                    <label className="risk-label" style={{ fontSize: "20px" }}>
                      Charges in Calculator
                    </label>
                    <div className="flex gap10">
                      <Button
                        text="Add"
                        color="#05ab72"
                        onClick={() => charges("added")}
                        style={{
                          padding: "3px 10px",
                          fontSize: "12px",
                          disabled:
                            showNote.target["greater"] ||
                            showNote.stopLoss["less"],
                        }}
                      />

                      <Button
                        text="Remove"
                        color="#fe5a5a"
                        onClick={() => charges("removed")}
                        style={{
                          padding: "3px 10px",
                          fontSize: "12px",
                          disabled:
                            showNote.target["greater"] ||
                            showNote.stopLoss["less"],
                        }}
                      />
                    </div>
                  </div>
                </div>
                {chargesSummaryList.map((item, idx) => (
                  <div className="charges-summary-row" key={idx}>
                    <span className="charges-summary-label">{item.label}</span>
                    <span className="charges-summary-value">
                      {typeof item.value === "number"
                        ? formatINR(item.value || 0)
                        : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankNiftyOptions = ({ update, setCurrentCalc, clearAll, formatter }) => {
  const data = [
    {
      symbol: "BANKNIFTY",
      type: "ATM",
      date: "24-Nov-22",
      strike: "41350",
      optionType: "CE",
      buyPrice: "62.70",
      currentPrice: "65.25",
      quantity: "100",
    },
    {
      symbol: "BANKNIFTY",
      type: "OTM",
      date: "24-Nov-22",
      strike: "41400",
      optionType: "CE",
      buyPrice: "829.20",
      currentPrice: "820.35",
      quantity: "50",
    },
    {
      symbol: "BANKNIFTY",
      type: "OTM",
      date: "24-Nov-22",
      strike: "41450",
      optionType: "CE",
      buyPrice: "146.75",
      currentPrice: "176.05",
      quantity: "75",
    },
    {
      symbol: "BANKNIFTY",
      type: "OTM",
      date: "24-Nov-22",
      strike: "41500",
      optionType: "CE",
      buyPrice: "942.40",
      currentPrice: "940.20",
      quantity: "25",
    },
  ];

  const handlePriceSelect = (item) => {
    clearAll();

    setCurrentCalc("risk-management");

    const updated = {
      buyPrice: formatter(item.buyPrice),
      qty: formatter(item.quantity),
      sellPrice: formatter(item.buyPrice),
    };

    update("stopLoss", updated);
    update("target", updated);
    update("transaction", updated);
  };

  return (
    <>
      <div className="banknifty-container">
        {data.map((item, index) => (
          <div
            key={index}
            className="trading-item"
            onClick={() => handlePriceSelect(item)}
          >
            <div className="left-section">
              <div className="symbol-row">
                <span className="symbol-name">{item.symbol}</span>
                <span className={`type-badge ${item.type.toLowerCase()}`}>
                  {item.type}
                </span>
              </div>
              <div className="option-details">
                {item.date} {item.strike} {item.optionType}
              </div>
            </div>
            <div className="right-section">
              <div className="price-info">
                <div className="price-label">Buy Price</div>
                <div className="buy-price">₹{item.buyPrice}</div>
                <div className="quantity-info">Qty: {item.quantity}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default RiskManagement;
