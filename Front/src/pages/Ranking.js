import React, { useState, useEffect } from 'react';
import Confetti from '../components/Confetti';
import './Ranking.css';
import profileImage from '../image/profile.png';
import api from '../axios';  // axios.js에서 만든 api 인스턴스를 가져옵니다.

import PageSubMenu from '../components/PageSubMenu'; /*sub*/
import Banner from '../components/Banner';
import banner1 from '../image/rankingbanner.jpg';

const Rankings = () => {
  const menuItems = ["일간 랭킹", "주간 랭킹", "월간 랭킹"];
  const [currentPage, setCurrentPage] = useState(1);
  const [rankings, setRankings] = useState([]);
  const [rankingType, setRankingType] = useState('daily'); // 기본 랭킹 타입은 '일간'
  const [userSummary, setUserSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const itemsPerPage = 15;

  // 랭킹 데이터 가져오기
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get(`/api/rankings/${rankingType}`); // API 요청
        setRankings(response.data);
      } catch (error) {
        console.error('랭킹 데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    fetchRankings();
  }, [rankingType]);

  // 닉네임 클릭 시 요약 정보 표시
  const handleNicknameClick = async (id) => {
    try {
      const response = await api.get(`/api/users/${id}/summary`);
      setUserSummary(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('사용자 요약 정보를 불러오는 중 오류가 발생했습니다:', error);
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRankings = rankings.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 메뉴 클릭 시 랭킹 타입 변경
  const handleMenuClick = (index) => {
    setActiveIndex(index);
    setRankingType(index === 0 ? 'daily' : index === 1 ? 'weekly' : 'monthly');
    setCurrentPage(1); // 페이지 초기화
  };

  // 순위 아이콘 및 배경색 설정
  const getRankIcon = (rank) => {
    if (rank === 1) return <span style={{ fontSize: '2em' }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize: '2em' }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize: '2em' }}>🥉</span>;
    return rank;
  };
  const getBackgroundColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'rgb(205, 127, 50)';
    return '';
  };


  return (
    <div className="ranking-container">
      <Confetti />
      <Banner src={banner1} title="🏆랭킹" />

      <div className="post-form-container"> {/*sub*/}
        <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>

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
                <td>{getRankIcon(realIndex)}</td>
                <td className="profile-cell">
                  {rank.profile ? (
                    <img src={rank.profile} alt="프로필 사진" style={{ width: '50px', height: '50px' }} />
                  ) : (
                    <img src={profileImage} alt="기본 프로필 사진" style={{ width: '50px', height: '50px' }} />
                  )}
                </td>
                {/* 닉네임에 클릭 이벤트 추가 */}
                <td onClick={() => handleNicknameClick(rank.id)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {rank.nickname}
                </td>
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

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h3>사용자 요약 정보</h3>
            {userSummary ? (
              <div>
                <p>닉네임: {userSummary.nickname}</p>
                <p>포인트: {userSummary.points}</p>
                <p>아이디: {userSummary.userId}</p>
              </div>
            ) : (
              <p>요약 정보를 불러오는 중입니다...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rankings;
