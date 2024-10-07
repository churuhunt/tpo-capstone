import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Mainpage.css';

import mainimg1 from '../image/mainimg1.jpg';
import mainimg2 from '../image/mainimg2.jpg';
import mainimg3 from '../image/mainimg3.jpg';

const slideImages = [mainimg1, mainimg2, mainimg3];

const Mainpage = () => {
  return (
    <div className="main-page">
      <div className="background-overlay"></div>
      <div className="content">
        <div className="slideshow-container">
          <Slide easing="ease">
            {slideImages.map((image, index) => (
              <div className="each-slide" key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Slide>
        </div>
        <div className="sections-container">
          {/* 첫 번째 영역 - 공지사항 */}
          <div className="section">
            <h2>📢 공지사항</h2>
            <ul>
              <li>공지사항 1</li>
              <li>공지사항 2</li>
              <li>공지사항 3</li>
            </ul>
            <button className="more-button">더보기</button>
          </div>

          {/* 두 번째 영역 - 인기 게시판 */}
          <div className="section">
            <h2>🔥인기</h2>
            <div className="popularity-links">
              <a className="period-link">일간</a>
              <a className="period-link">주간</a>
              <a className="period-link">월간</a>
              <a className="period-link">연간</a>
            </div>
            <ul className="popular-posts">
              <li>인기글 1</li>
              <li>인기글 2</li>
              <li>인기글 3</li>
              <li>인기글 4</li>
              <li>인기글 5</li>
            </ul>
            <button className="more-button">더보기</button>
          </div>

          {/* 세 번째 영역 - 추천 게시판 */}
          <div className="section">
            <h2>🏆랭킹</h2>
            <ul>
              <li>추천글 1</li>
              <li>추천글 2</li>
              <li>추천글 3</li>
              <li>추천글 4</li>
              <li>추천글 5</li>
            </ul>
            <button className="more-button">더보기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
