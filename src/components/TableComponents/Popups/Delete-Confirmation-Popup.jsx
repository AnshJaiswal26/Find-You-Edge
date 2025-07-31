import React from "react";
import { Button } from "@components";

const DeleteConfirmationPopup = ({ confirmDelete, cancelDelete }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <p>Are you sure you want to delete this record?</p>
        <div className="delete-modal-buttons">
          <Button text="Ok" onClick={confirmDelete} styleType="SAVE" />
          <Button text="Cancel" onClick={cancelDelete} styleType="DELETE" />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
