// PositionAwareButton.js
import React from 'react';
import './PositionAwareButton.css';

const PositionAwareButton = ({ text, onClick }) => {
  return (
    <div className="frame">
      <button className="custom-btn btn-8" onClick={onClick}>
        <span>{text}</span>
      </button>
    </div>
  );
};

export default PositionAwareButton;
