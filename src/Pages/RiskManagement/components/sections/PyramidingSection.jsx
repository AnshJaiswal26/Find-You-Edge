import React from "react";
import { Button } from "@components";
import { useRiskCalculator, useNote } from "@RM/context";
import { useInputChange, useInputValidator } from "@RM/hooks";

export default function PyramidingSection() {
  console.log("Pyramiding...");
  const { stopLoss, pyramiding, updateRiskCalculator } = useRiskCalculator();
  const { note } = useNote();
  const handleChange = useInputChange();
  const handleSpecialCases = useInputValidator();

  const handleLayerChange = (direction) => {
    const currentLayer = pyramiding.currentLayer;
    const totalLayers = pyramiding.table.rows.length;
    if (direction === "next" && currentLayer < totalLayers - 1) {
      updateRiskCalculator("pyramiding", { currentLayer: currentLayer + 1 });
    } else if (direction === "prev" && currentLayer > 0) {
      updateRiskCalculator("pyramiding", { currentLayer: currentLayer - 1 });
    }
  };

  return (
    <div style={{ display: "flex", gap: "15px" }}>
      <div className="calculator-sections" style={{ "--grid-width": "100px" }}>
        <div className="section-heading">
          <span className="">Pyramiding</span>
        </div>

        <div className="risk-input-row">
          <div className="risk-input-group">
            <label className="risk-label">Current Layer</label>
            <div className="risk-input flex center justify">
              <img
                src="Icons/others/back-arrow.png"
                style={{
                  filter: "invert(0.7)",
                }}
                onClick={() => handleLayerChange("prev")}
                alt=""
              />
              <span>{pyramiding.currentLayer + 1}</span>

              <img
                src="Icons/others/right-arrow.png"
                style={{
                  filter: "invert(0.7)",
                }}
                onClick={() => handleLayerChange("next")}
                alt=""
              />
            </div>
          </div>
          <div className="risk-input-group">
            <span className="risk-label">Risk Increment</span>
            <select
              className="risk-input"
              style={{ fontSize: "14px", padding: "8px" }}
              onChange={(e) =>
                updateRiskCalculator("pyramiding", {
                  riskIncrement: e.target.value,
                })
              }
            >
              <option>Fix</option>
              <option>Cumulative</option>
            </select>
          </div>
          <div className="risk-input-group">
            <span className="risk-label">Risk (%)</span>
            <input
              className="risk-input"
              type="text"
              value={
                pyramiding.table.rows[pyramiding.currentLayer].riskPerLayer
              }
              readOnly
            />
          </div>
          <div className="risk-input-group">
            <label className="risk-label">Add Qty</label>
            <input
              className="risk-input"
              type={"text"}
              value={
                pyramiding.table.rows[pyramiding.currentLayer].addQty === 0
                  ? stopLoss.qty
                  : pyramiding.table.rows[pyramiding.currentLayer].addQty
              }
              onChange={(e) => {
                handleChange(pyramiding, "addQty", e.target.value);
              }}
              min={0}
            />
          </div>
          <div className="risk-input-group">
            <label className="risk-label">At Buy Price</label>
            <div style={{ display: "flex" }}>
              <input
                className="risk-input"
                value={
                  pyramiding.at === "priceAchieved"
                    ? pyramiding.table.rows[pyramiding.currentLayer]
                        .priceAchieved === 0
                      ? stopLoss.buyPrice
                      : pyramiding.table.rows[pyramiding.currentLayer]
                          .priceAchieved
                    : pyramiding.table.rows[pyramiding.currentLayer].rrAchieved
                }
                onChange={(e) => {
                  handleChange(pyramiding, pyramiding.at, e.target.value);
                }}
                onBlur={(e) =>
                  handleSpecialCases(
                    pyramiding,
                    pyramiding.at,
                    e.target.value,
                    true,
                    updateRiskCalculator
                  )
                }
                type="text"
                min={0}
              />
            </div>
            {/* <InputNote
              message="Please enter Entry Price or Risk/Reward ratio before specifying Quantity"
              down={false}
              show={note[pyramiding.name].achieved}
              style={{ bottom: "45px" }}
            /> */}
          </div>
        </div>
        <div className="footer-buttons">
          <Button
            text="See Ladder"
            color="#056bab"
            style={{ padding: "6px 10px" }}
          />
        </div>
      </div>
    </div>
  );
}
