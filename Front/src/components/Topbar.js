import React from 'react';
import './Topbar.css';
import logoImage from '../image/Logo.png';
import { Link } from 'react-router-dom';
import PositionAwareButton from '../components/PositionAwareButton';

const Topbar = () => {
  return (
    <header className="top-menu">
      <div className="logo">
        <Link to="/main">
          <img src={logoImage} alt="MyLogo" width="70px" height="60px" />
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/notification">📢공지사항</Link>
            <ul className="submenu">
              <li><Link to="/notification/updates">📢공지사항</Link></li>
              <li><Link to="/notification/events">🎁이벤트</Link></li>
              <li><Link to="/notification/announcements">🆙업데이트</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/popularity">🔥인기</Link>
            <ul className="submenu">
              <li><Link to="/popularity/daily">😺일간 게시판</Link></li>
              <li><Link to="/popularity/weekly">😸주간 게시판</Link></li>
              <li><Link to="/popularity/monthly">😹월간 게시판</Link></li>
              <li><Link to="/popularity/monthly">😻연간 게시판</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/community">💬커뮤니티</Link>
            <ul className="submenu">
              <li><Link to="/community/free">🗽자유 게시판</Link></li>
              <li><Link to="/community/questions">👖데일리룩 게시판</Link></li>
              <li><Link to="/community/questions">❔질문 게시판</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/recommendedboard">👍추천</Link>
            <ul className="submenu">
              <li><Link to="/recommendedboard/top">👍추천 게시판</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/informationboard">ℹ️정보</Link>
            <ul className="submenu">
              <li><Link to="/informationboard/articles">🕺패션정보</Link></li>
              <li><Link to="/informationboard/tutorials">💲세일정보</Link></li>
              <li><Link to="/informationboard/tutorials">🎸기타정보</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/ranking">🏆랭킹</Link>
            <ul className="submenu">
              <li><Link to="/ranking/world">레벨 랭킹</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/store">🏪상점</Link>
            <ul className="submenu">
              <li><Link to="/store/items">아이템 상점</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/mymenu">⭐마이메뉴</Link>
            <ul className="submenu">
              <li><Link to="/mymenu/profile">👤프로필</Link></li>
              <li><Link to="/mymenu/settings">⚙️설정</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
      <Link to="/Login">
        <PositionAwareButton />
      </Link>
    </header>
  );
};

export default Topbar;
