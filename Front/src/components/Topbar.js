import React from 'react';
import './Topbar.css';
import logoImage from '../image/Logo.png';
import { Link } from 'react-router-dom';
import PositionAwareButton from '../components/PositionAwareButton';

const Topbar = () => {
  return (
    <header className="top-menu">
       <div className="logo">
       <Link to="/main"><img src={logoImage} alt="MyLogo" width="70px" height="60px"/></Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/notification">📢공지사항</Link></li>
          <li><Link to="/popularity">🔥인기</Link></li>
          <li><Link to="/community">💬커뮤니티</Link></li>
          <li><Link to="/Recommendedboard">👍추천</Link></li>
          <li><Link to="/informationboard">ℹ️정보</Link></li>
          <li><Link to="/ranking">🏆랭킹</Link></li>
          <li><Link to="/store">🏪상점</Link></li>
          <li><Link to="/mymenu">⭐마이메뉴</Link></li>
        </ul>
      </nav>
      <Link to="/Login"><PositionAwareButton/></Link>
      
    </header>
  );
}

export default Topbar;
