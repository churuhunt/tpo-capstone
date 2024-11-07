import React from 'react';
import './Topbar.css';
import logoImage from '../image/Logo.png';
import { Link } from 'react-router-dom';
import PositionAwareButton from '../components/PositionAwareButton';

const Topbar = () => {
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
          <li><Link to="/mymenu">⭐마이홈</Link></li>
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
                <li><Link to="/profile">👤프로필</Link></li>
                <li><Link to="/settings">⚙️설정</Link></li>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Link to="/Login">
        <PositionAwareButton />
      </Link>
    </div>
  );
};

export default Topbar;
