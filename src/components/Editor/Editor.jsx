import React, { useState, useContext } from "react";
import { UIContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import "./Editor.css";
function Editor() {
  const navigate = useNavigate();
  const {
    toggleSidebar,
    selectedAvatar,
    userName,
    setUserName,
    setSelectedAvatar,
    toggleTheme,
  } = useContext(UIContext);

  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(selectedAvatar);
  const [newUserName, setNewUserName] = useState(userName);

  const avatars = [
    "Icons/avtar/office-man.png",
    "Icons/avtar/boy (1).png",
    "Icons/avtar/boy.png",
    "Icons/avtar/gamer.png",
    "Icons/avtar/girl.png",
    "Icons/avtar/hacker.png",
    "Icons/avtar/man (1).png",
    "Icons/avtar/man.png",
    "Icons/avtar/profile.png",
    "Icons/avtar/woman (1).png",
    "Icons/avtar/woman.png",
  ];

  const toggleFilterPopup = () => setIsFilterPopupOpen(!isFilterPopupOpen);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const applyAndClose = () => {
    setIsFilterApplied(true);
    toggleFilterPopup();
  };
  const applyAndClear = () => {
    setIsFilterApplied(!isFilterApplied);
    toggleFilterPopup();
  };

  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen);
    setTempAvatar(selectedAvatar);
    setNewUserName(userName);
  };

  const handleAvatarSelect = (avatar) => setTempAvatar(avatar);
  const handleSaveChanges = () => {
    setSelectedAvatar(tempAvatar);
    setUserName(newUserName);
    setIsAvatarPopupOpen(false);
  };

  return (
    <>
      <div className="editor-dashboard-editor">
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div className="editor-editor-actions-1">
            <button className="editor-button">
              <img
                className="editor-icon"
                src="Icons/others/menus.png"
                alt="Menu"
                onClick={toggleSidebar}
              />
            </button>
            <button
              className={
                isFilterApplied
                  ? "editor-filter-button active"
                  : "editor-filter-button"
              }
              onClick={toggleFilterPopup}
            >
              <img src="Icons/others/funnel.png" alt="Filter" />
              <span>{isFilterApplied ? "Filtered" : "Apply Filters"}</span>
            </button>
          </div>
          <div className="editor-editor-actions-2">
            <img
              src={selectedAvatar}
              alt="Profile"
              className="editor-profile-pic"
              onClick={toggleAvatarPopup}
              style={{ cursor: "pointer" }}
            />
            <div className="editor-user-name">
              <strong>{userName}</strong>
            </div>
            <button className="editor-button">
              <img
                src="Icons/others/themes.png"
                alt="theme"
                className="editor-icon"
                style={{ width: "26px", height: "25px" }}
                onClick={toggleTheme}
              />
            </button>
            <button className="editor-button">
              <img
                src="Icons/others/bell2.png"
                alt="Notifications"
                className="editor-icon"
              />
            </button>
            <button className="editor-button">
              <img
                src="Icons/others/settings.png"
                alt="Settings"
                className="editor-icon"
                onClick={() => navigate("/settings")}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Avatar Popup */}
      {isAvatarPopupOpen && (
        <div className="editor-modal-overlay">
          <div className="editor-avatar-popup">
            <button
              className="editor-close-button-avatar"
              onClick={toggleAvatarPopup}
            >
              &times;
            </button>
            <h3>Select Your Avatar</h3>
            <div className="editor-avatar-grid">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`editor-avatar-option ${
                    tempAvatar === avatar ? "editor-selected" : ""
                  }`}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
            <div className="editor-change-name-section">
              <table>
                <tr>
                  <td>
                    <label htmlFor="editor-change-name-input">
                      Change Name:
                    </label>
                  </td>
                  <td>
                    <input
                      id="editor-change-name-input"
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Enter new name"
                    />
                  </td>
                  <td>
                    <button
                      className="editor-avatar-save-button"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Filter Popup */}
      {isFilterPopupOpen && (
        <div className="editor-modal-overlay-filter">
          <div className="editor-modal-filter">
            <table style={{ width: "100%" }}>
              <tr>
                <td style={{ width: "95%" }}>
                  <h3>Filter Options</h3>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="editor-close-button"
                    onClick={toggleFilterPopup}
                  >
                    &times;
                  </button>
                </td>
              </tr>
            </table>

            <div className="editor-filter-options">
              <div className="editor-filter-group">
                <label>Date Range:</label>
                <select className="editor-date-range-dropdown">
                  <option value="">Select Range</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last15days">Last 15 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                </select>
              </div>
              <div className="editor-filter-group-row">
                <div className="editor-filter-group">
                  <label>Start Date:</label>
                  <input type="date" />
                </div>
                <div className="editor-filter-group">
                  <label>End Date:</label>
                  <input type="date" />
                </div>
              </div>
              <div className="editor-filter-group">
                <label>Last Number of Trades:</label>
                <input type="number" placeholder="Enter number of trades" />
              </div>
            </div>
            <div className="editor-modal-filter-buttons">
              <button className="editor-clear-button" onClick={applyAndClear}>
                Clear
              </button>
              <button
                className="editor-filter-apply-button"
                onClick={applyAndClose}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Editor;
