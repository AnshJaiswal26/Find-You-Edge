import React, { useState } from "react";
import "./SetupRules.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Editor from "../../components/Editor/Editor";

const SetupRules = () => {
  const [setups, setSetups] = useState([]);
  const [error, setError] = useState("");

  const handleAddSetup = () => {
    if (setups.length >= 10) {
      setError("You can only add a maximum of 10 setups.");
      return;
    }
    setSetups([
      ...setups, // Correctly use the `setups` state variable
      { image: null, heading: "", notes: "", isSetupNameEntered: false },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedSetups = setups.filter((_, i) => i !== index);
    setSetups(updatedSetups);
  };

  const handleChangeSetup = (index) => {
    const updatedSetups = [...setups];
    updatedSetups[index] = {
      ...updatedSetups[index],
      image: null,
    };
    setSetups(updatedSetups);
  };

  const handleInputChange = (index, field, value) => {
    const updatedSetups = [...setups];
    updatedSetups[index][field] = value;
    setSetups(updatedSetups);
  };

  const handleImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updatedSetups = [...setups];
      updatedSetups[index].image = reader.result;
      setSetups(updatedSetups);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (setups.some((setup) => !setup.heading.trim() || !setup.notes.trim())) {
      setError("All headings and notes must be filled.");
      return;
    }
    setError("");
    console.log("Saved Setups:", JSON.stringify(setups, null, 2));
    alert("Setups saved successfully!");
  };

  return (
    <div>
      <Editor />
      <Sidebar pageActive={"setuprules"} />
      <div
        className=""
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="setup-rules-container">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              className="sidebar-icons"
              src="Icons/sidebar/rules.png"
              alt="Setup Rules"
            />
            <h2>Strategy Rules</h2>
          </div>

          <div className="setup-actions">
            <button
              className="add-setup-button"
              onClick={handleAddSetup}
              style={{
                pointerEvents: setups.length > 10 ? "none" : "auto",
              }}
            >
              + Add Setup
            </button>
            <button className="save-setup-button" onClick={handleSubmit}>
              Save Setups
            </button>
          </div>
          <div
            style={{ textAlign: "right", marginBottom: "20px" }}
            className="numOfRecords"
          >
            <span>{`Current Setups ${setups.length}`}</span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="setup-grid">
            {setups.length !== 0 ? (
              setups.map((setup, index) => (
                <div key={index} className="setup-row">
                  <div className="setup-cell-1">
                    <div className="setup-header">
                      <h3>Upload your setup image</h3>
                    </div>
                    <div className="setup-body-1">
                      <div className="setup-name">
                        {setup.heading ? setup.heading : "Enter Setup Name"}
                      </div>

                      {setup.image ? (
                        <div className="image-container">
                          <img
                            src={setup.image}
                            alt="Setup"
                            className="setup-image-preview"
                          />
                          <button
                            className="delete-row-button"
                            onClick={() => handleChangeSetup(index)}
                          >
                            Change Setup
                          </button>
                        </div>
                      ) : (
                        <div className="upload-input-container">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, e.target.files[0])
                            }
                            className="file-input"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="setup-cell-2">
                    <div className="setup-header">
                      <h3>Enter Setup Details</h3>
                    </div>
                    <div className="setup-body-2">
                      <div className="input-row">
                        <input
                          type="text"
                          placeholder="Enter Setup Name"
                          onChange={(e) =>
                            handleInputChange(index, "heading", e.target.value)
                          }
                        />
                        <input type="text" placeholder="Enter Entry Candle" />
                      </div>
                      <div className="input-row">
                        <input type="text" placeholder="Enter Exit Condition" />

                        <input
                          type="text"
                          placeholder="Enter Entry Condition"
                        />
                      </div>
                      <div className="input-row">
                        <input type="text" placeholder="Minimum Risk Reward" />

                        <input type="text" placeholder="Indicator Name" />
                      </div>

                      <div className="input-row">
                        <textarea
                          placeholder="Notes"
                          style={{ height: "140px" }}
                          value={setup.notes}
                          onChange={(e) =>
                            handleInputChange(index, "notes", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <button
                          className="delete-row-button"
                          onClick={() => handleDeleteRow(index)}
                        >
                          Delete Setup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  color: "#8c8c8c",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <h3>No Strategy Defined</h3>
                <p>To Define your Strategies and Rules Click On 'Add Setup'</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupRules;
