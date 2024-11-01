import React, { useState, useEffect } from 'react';
import Confetti from '../components/Confetti';
import './Ranking.css';
import profileImage from '../image/profile.png';
import api from '../axios';  // axios.js에서 만든 api 인스턴스를 가져옵니다.


const Rankings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rankings, setRankings] = useState([]);
  const [rankingType, setRankingType] = useState('total'); // 기본 랭킹 타입은 '전체'

  const itemsPerPage = 15;


  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get(`/rankings/${rankingType}`); // api 인스턴스를 사용하여 요청
        setRankings(response.data);
      } catch (error) {
        console.error('랭킹 데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchRankings();
  }, [rankingType]);

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
                    <img src={rank.profile} alt="프로필 사진" style={{ width: '50px', height: '50px' }} />
                  ) : (
                    <img src={profileImage} alt="기본 프로필 사진" style={{ width: '50px', height: '50px' }} />
                  )}
                </td>
                <td>{rank.nickname}</td>
                <td>{rank.points}</td>
              </tr>
            );
          })}
          {Array(itemsPerPage - currentRankings.length)
            .fill()
            .map((_, index) => (
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
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentRankings.length < itemsPerPage}>
          다음
        </button>
      </div>
    </div>
  );
};

export default Rankings;
