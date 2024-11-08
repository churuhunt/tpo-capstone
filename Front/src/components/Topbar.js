import React, { useState, useEffect } from "react";
import './Topbar.css';
import logoImage from '../image/Logo.png';
import { Link, useNavigate } from "react-router-dom";
import PositionAwareButton from '../components/PositionAwareButton';


const Topbar = () => {
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 여부 확인
    const token = localStorage.getItem("token"); // 토큰이 있으면 로그인 상태로 설정
    setIsLoggedIn(!!token);

    // 로그인/로그아웃 시 'storage' 이벤트 감지
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem("token"); // 로컬 스토리지의 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 업데이트
    alert("로그아웃 되었습니다.");
    navigate("/"); // 로그아웃 후 홈 페이지로 이동
  };

  const handleProtectedRoute = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent the link from navigating
      alert('로그인이 필요한 서비스입니다');
      navigate('/Login');
    }
  };

  return (
    <div className="top-menu">
      <div className="logo">
        <Link to="/main">
          <img
            src={logoImage}
            alt="MyLogo"
            width="70px"
            height="60px"
          />
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/notification">📢공지사항</Link></li>
          <li><Link to="/popularity">🔥인기</Link></li>
          <li><Link to="/community">💬커뮤니티</Link></li>
          <li><Link to="/recommendedboard">👍추천</Link></li>
          <li><Link to="/informationboard">ℹ️정보</Link></li>
          <li><Link to="/ranking">🏆랭킹</Link></li>
          <li><Link to="/store">🏪상점</Link></li>
          <li><Link to="/mymenu" onClick={(e) => handleProtectedRoute(e, '/mymenu')}>⭐마이홈</Link></li>
        </ul>
      </nav>
      <div className="submenu">
        <div className="submenu-2">
          <nav>
            <ul>
              <li>
                <li><Link to="/notification/updates">📢공지사항</Link></li>
                <li><Link to="/notification/events">🎁이벤트</Link></li>
                <li><Link to="/notification/announcements">🆙업데이트</Link></li>
              </li>

              <li>
                <li><Link to="/popularity/daily">😺일간 게시판</Link></li>
                <li><Link to="/popularity/weekly">😸주간게시판</Link></li>
                <li><Link to="/popularity/monthly">😹월간게시판</Link></li>
                <li><Link to="/popularity/monthly">😻연간게시판</Link></li>
              </li>

              <li>
                <li><Link to="/free">🗽자유게시판</Link></li>
                <li><Link to="/DailyLook">👖데일리룩게시판</Link></li>
                <li><Link to="/Questions">❔질문게시판</Link></li>
              </li>

              <li>
                <li><Link to="/Articles">🕺패션정보</Link></li>
                <li><Link to="/Sales">💲세일정보</Link></li>
                <li><Link to="/Others">🎸기타정보</Link></li>
              </li>

              <li>
                <li><Link to="/ranking">레벨랭킹</Link></li>
              </li>
              <li>
                <li><Link to="/profile" onClick={(e) => handleProtectedRoute(e, '/profile')}>👤프로필</Link></li>
                <li><Link to="/settings" onClick={(e) => handleProtectedRoute(e, '/settings')}>⚙️설정</Link></li>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {isLoggedIn ? (
                <PositionAwareButton text="로그아웃" onClick={handleLogout} />
            ) : (
            <Link to="/Login">
              <PositionAwareButton text="로그인" />
            </Link>
      )}
    </div>
  );
};

export default Topbar;
