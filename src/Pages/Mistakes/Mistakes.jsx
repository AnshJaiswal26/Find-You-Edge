import React, { useState } from "react";
import "./Mistakes.css";
import Editor from "../../components/Editor/Editor";
import Sidebar from "../../components/Sidebar/Sidebar";

function Mistakes() {
  const [mistakes, setMistakes] = useState([]);
  const [newMistake, setNewMistake] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const addMistake = () => {
    if (newMistake.trim()) {
      setMistakes([...mistakes, newMistake]);
      setNewMistake("");
    }
  };

  const deleteMistake = (index) => {
    const updatedMistakes = mistakes.filter((_, i) => i !== index);
    setMistakes(updatedMistakes);
  };

  const editMistake = (index, updatedText) => {
    const updatedMistakes = mistakes.map((mistake, i) =>
      i === index ? updatedText : mistake
    );
    setMistakes(updatedMistakes);
  };

  return (
    <div>
      <Editor />
      <Sidebar pageActive={"mistakes"} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="mistakes-container">
          <div className="mistakes-heading">
            <img
              className="sidebar-icons"
              src="Icons/sidebar/cross.png"
              alt="Mistakes To Avoid"
            />
            <h2>Mistakes to avoid</h2>
          </div>
          <div className="mistakes-paper">
            {mistakes.map((mistake, index) => (
              <div key={index} className="mistake-row">
                <div>
                  <img
                    src="Icons/others/cancel.png"
                    className="mistake-icon"
                    alt="do not mistake"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <textarea
                    value={mistake}
                    onChange={(e) => editMistake(index, e.target.value)}
                    className="mistake-textarea"
                    onMouseLeave={() => setIsEditing(false)}
                    onMouseEnter={() => setIsEditing(true)}
                    readOnly={!isEditing}
                    placeholder="Write your mistakes here..."
                  />
                </div>

                <div>
                  <button
                    className="delete-button"
                    onClick={() => deleteMistake(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mistake-row">
              <span>
                <img
                  src="Icons/others/cancel.png"
                  className="mistake-icon"
                  alt="do not mistake"
                />
              </span>
              <div style={{ flex: 1 }}>
                {" "}
                <textarea
                  type="text"
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  placeholder="Write your mistakes here..."
                  className="mistake-textarea"
                />
              </div>
              <button className="add-button" onClick={addMistake}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mistakes;
