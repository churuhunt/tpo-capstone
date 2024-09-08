import React from 'react';
import './Confetti.css'; 

const Confetti = () => {
  const createConfetti = () => {
    const confettiCount = 100;
    const confettiArray = [];
    for (let i = 0; i < confettiCount; i++) {
      const style = {
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 5 + 3}s`
      };
      confettiArray.push(<div key={i} className="confetti" style={style}></div>);
    }
    return confettiArray;
  };

  return (
    <div>
      {createConfetti()}
    </div>
  );
};

export default Confetti;
