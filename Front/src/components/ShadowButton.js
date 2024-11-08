import React from 'react';
import './ShadowButton.css';

const ShadowButton = ({ children, onClick }) => {
  return (
    <div className="ShadowButton-wrap">
      <button className="ShadowButton" onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default ShadowButton;
