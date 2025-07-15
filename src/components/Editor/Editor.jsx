import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Editor.css";

import FilterPopup from "./components/FilterPopup";
import { useUI } from "../../context/Context";

function Editor() {
  console.log("Editor...");
  const navigate = useNavigate();
  const { toggleSidebar, selectedAvatar, userName, toggleTheme } = useUI();

  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

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

  return (
    <>
      <div className="editor-dashboard-editor">
        <EditorLeftActions
          toggleSidebar={toggleSidebar}
          isFilterApplied={isFilterApplied}
          toggleFilterPopup={toggleFilterPopup}
        />
        <EditorRightActions
          selectedAvatar={selectedAvatar}
          userName={userName}
          toggleTheme={toggleTheme}
          navigate={navigate}
        />
      </div>

      {isFilterPopupOpen && (
        <FilterPopup
          toggleFilterPopup={toggleFilterPopup}
          applyAndClear={applyAndClear}
          applyAndClose={applyAndClose}
        />
      )}
    </>
  );
}

function EditorLeftActions({
  toggleSidebar,
  isFilterApplied,
  toggleFilterPopup,
}) {
  console.log("left section run");
  return (
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
    </div>
  );
}

function EditorRightActions({
  selectedAvatar,
  userName,
  toggleTheme,
  navigate,
}) {
  console.log("right section run");

  return (
    <div className="editor-editor-actions-2">
      <img src={selectedAvatar} alt="Profile" className="editor-profile-pic" />
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
  );
}

export default Editor;
