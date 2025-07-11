import React from "react";
import { handleSpecialCases } from "./function";
import InputNote from "../../../components/InputTooltip/InputNote";
import Button from "../../../components/Button/Button";

function PyramidingSection({
  section,
  showNote,
  handleChange,
  update,
  getterMap,
}) {
  const handleLayerChange = (direction) => {
    const currentLayer = section.currentLayer;
    const totalLayers = section.table.rows.length;
    if (direction === "next" && currentLayer < totalLayers - 1) {
      update("section", { currentLayer: currentLayer + 1 });
    } else if (direction === "prev" && currentLayer > 0) {
      update("section", { currentLayer: currentLayer - 1 });
    }
  };

  const target = getterMap["target"];
  const stopLoss = getterMap["stopLoss"];

  return (
    <div style={{ display: "flex", gap: "15px" }}>
      <div className="calculator-sections" style={{ "--grid-width": "100px" }}>
        <div className="section-heading">
          <span className={"element"}>Pyramiding</span>
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
              <span>{section.currentLayer + 1}</span>

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
                update("section", {
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
              value={section.table.rows[section.currentLayer].riskPerLayer}
              readOnly
            />
          </div>
          <div className="risk-input-group">
            <label className="risk-label">Add Qty</label>
            <input
              className="risk-input"
              type={"text"}
              value={
                section.table.rows[section.currentLayer].addQty === 0
                  ? stopLoss.qty
                  : section.table.rows[section.currentLayer].addQty
              }
              onChange={(e) => handleChange(section, "addQty", e.target.value)}
              min={0}
            />
          </div>
          <div className="risk-input-group">
            <label className="risk-label">At Buy Price</label>
            <div style={{ display: "flex" }}>
              <input
                className="risk-input"
                value={
                  section.at === "priceAchieved"
                    ? section.table.rows[section.currentLayer].priceAchieved ===
                      0
                      ? stopLoss.buyPrice
                      : section.table.rows[section.currentLayer].priceAchieved
                    : section.table.rows[section.currentLayer].rrAchieved
                }
                onChange={(e) =>
                  handleChange(section, section.at, e.target.value)
                }
                onBlur={(e) =>
                  handleSpecialCases(
                    section,
                    section.at,
                    e.target.value,
                    true,
                    update
                  )
                }
                type="text"
                min={0}
              />
            </div>
            <InputNote
              message="Please enter Entry Price or Risk/Reward ratio before specifying Quantity"
              down={false}
              show={showNote[section.name].achieved}
              style={{ bottom: "45px" }}
            />
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

export default PyramidingSection;
