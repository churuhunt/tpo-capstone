import React, { useState } from 'react';
import './BubblyButton.css';

const BubblyButton = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`bubbly-button ${isHovered ? 'animate' : ''}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default BubblyButton;
