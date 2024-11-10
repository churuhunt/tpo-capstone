import React, { useState, useEffect } from 'react';
import Confetti from '../components/Confetti';
import './Ranking.css';
import profileImage from '../image/profile.png';
import api from '../axios';

import PageSubMenu from '../components/PageSubMenu';
import Banner from '../components/Banner';
import banner1 from '../image/rankingbanner.jpg';
import LoadingModal from '../components/LoadingModal';

const Rankings = () => {
  const menuItems = ["일간", "주간", "월간"];
  const [activeTab, setActiveTab] = useState("일간");  // 메뉴 탭 상태 사용
  const [currentPage, setCurrentPage] = useState(1);
  const [rankings, setRankings] = useState([]);
  const [rankingType, setRankingType] = useState('total');
  const [userSummary, setUserSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/rankings/${rankingType}`);
        setRankings(response.data);
      } catch (error) {
        console.error('랭킹 데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [rankingType]);

    const handleMenuClick = (tabName) => {
      setActiveTab(tabName);
      switch (tabName) {
        case "일간":
          setRankingType("daily");
          break;
        case "주간":
          setRankingType("weekly");
          break;
        case "월간":
          setRankingType("monthly");
          break;
        default:
          console.log("알 수 없는 탭");
          break;
      }
    };

  const handleNicknameClick = async (id) => {
    try {
      const response = await api.get(`/users/${id}/summary`);
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

  const getBackgroundColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'rgb(205, 127, 50)';
    return '';
  };

  const getPadding = (rank) => {
    if (rank === 1) return '20px';
    if (rank === 2) return '15px';
    if (rank === 3) return '10px';
    return '';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <span style={{ fontSize: '2em' }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize: '2em' }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize: '2em' }}>🥉</span>;
    return rank;
  };

  return (
    <div className="ranking-container">
      {loading ? (
        <LoadingModal />
      ) : (
        <>
          <Confetti />
          <Banner src={banner1} title="🏆랭킹" />

          <div className="post-form-container">
        <PageSubMenu
          items={menuItems}
          activeIndex={activeIndex}
          setActiveIndex={(index) => {
            setActiveIndex(index);
            handleMenuClick(menuItems[index]);
          }}
        />
          </div>

          <table className="ranking-table">
            <tbody>
              {currentRankings.map((rank, index) => {
                const realIndex = indexOfFirstItem + index + 1;
                return (
                  <tr
                    key={index}
                    className="ranking-item"
                    style={{
                      backgroundColor: getBackgroundColor(realIndex),
                      padding: getPadding(realIndex)   // rank에 따라 패딩 값 설정
                    }}
                  >
                    <td>{getRankIcon(realIndex)}</td>
                    <td className="profile-cell">
                      {rank.profileImageUrl ? (
                        <img src={rank.profileImageUrl} alt="프로필 사진" style={{ width: '60px', height: '60px' }} />
                      ) : (
                        <img src={profileImage} alt="기본 프로필 사진" style={{ width: '60px', height: '60px' }} />
                      )}
                    </td>
                    <td onClick={() => handleNicknameClick(rank.id)} style={{ cursor: 'pointer', color: 'black' }}>
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
            <div style={{ opacity: 0, fontSize: '1rem', display: 'flex' }}>{activeTab}</div>
          </div>

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
        </>
      )}
    </div>
  );
};

export default Rankings;
