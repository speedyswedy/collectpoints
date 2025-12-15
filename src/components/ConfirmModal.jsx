import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{children}</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Avbryt</button>
          <button className="confirm-btn" onClick={onConfirm}>Ja, ta bort</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
