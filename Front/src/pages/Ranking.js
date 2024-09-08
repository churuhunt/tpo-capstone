import React, { useState, useEffect } from 'react';
import Confetti from '../components/Confetti';
import './Ranking.css';
import profileImage from '../image/profile.png';


const Rankings = ({ rankings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  if (!rankings) {
    rankings = [
      { nickname: 'User1', points: 100 },
      { nickname: 'User3', points: 32 },
      { nickname: 'User5', points: 543 },
      { nickname: 'User5', points: 1430 },
      { nickname: 'User6', points: 9540 },
      { nickname: 'User31', points: 210 },
      { nickname: 'User2', points: 30 },
      { nickname: 'User5', points: 11 },
      { nickname: 'User7', points: 54 },
      { nickname: 'User6', points: 13213 },
      { nickname: 'User54', points: 23 },
      { nickname: 'User3', points: 542 },
      { nickname: 'User54', points: 23 },
      { nickname: 'User54', points: 28 },
      { nickname: 'User1', points: 101 },
      { nickname: 'User3', points: 33 },
      { nickname: 'User5', points: 542 },
      { nickname: 'User5', points: 1420 },
      { nickname: 'User6', points: 9530 },
      { nickname: 'User31', points: 200 },
      { nickname: 'User2', points: 21 },
      { nickname: 'User5', points: 41 },
      { nickname: 'User7', points: 34 },
      { nickname: 'User6', points: 12213 },
      { nickname: 'User54', points: 22 },
      { nickname: 'User3', points: 535 },
      { nickname: 'User54', points: 111 },
      { nickname: 'User54', points: 22 },
    ];
  }

  rankings.sort((a, b) => b.points - a.points);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRankings = rankings.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getBackgroundColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'rgb(205, 127, 50)';
    return '';
  };

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
    <div className="ranking-container">
      <Confetti />
      <h2>🏆랭킹</h2>
      <table className="ranking-table">
        <tbody>
          {currentRankings.map((rank, index) => {
            const realIndex = indexOfFirstItem + index + 1;
            return (
              <tr 
                key={index} 
                className="ranking-item" 
                style={{ backgroundColor: getBackgroundColor(realIndex) }}
              >
                <td>{realIndex}</td>
                <td className="profile-cell">
                  {rank.profile ? (
                    <img src={rank.profile} alt="프로필 사진" style={{ width: '30px', height: '30px' }} />
                  ) : (
                    <img src={profileImage} alt="프로필 사진" style={{ width: '35px', height: '35px' }} />
                  )}
                </td>
                <td>{rank.nickname}</td>
                <td>{rank.points}</td>
              </tr>
            );
          })}
          {Array(itemsPerPage - currentRankings.length).fill().map((_, index) => (
            <tr key={`empty-${index}`} className="ranking-item">
            <td></td>
            <td className="profile-cell"></td>
            <td></td>
            <td></td>
            </tr>
          ))}

        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>이전</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentRankings.length < itemsPerPage}>다음</button>
      </div>
    </div>
  );
};

export default Rankings;
