import React, { useState } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Mainpage.css';
import profileImage from '../image/profile.png'; // 기본 프로필 이미지

import mainimg1 from '../image/mainimg1.jpg';
import mainimg2 from '../image/mainimg2.jpg';
import mainimg3 from '../image/mainimg3.jpg';

const slideImages = [mainimg1, mainimg2, mainimg3];

const rankings = [
  { nickname: 'User6', points: 13213, profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' },
  { nickname: 'User6', points: 9540, profile: 'https://i.namu.wiki/i/AqqP_0SvJeN-Ho3VwvnVlUP9uFxZUHOIAqjQpnc6L5JYjdv4p5am1Q7UEy67RUY9VNSIgdWPfbgQF6vGmZcBJw.gif' },
  { nickname: 'User6', points: 12213, profile: null },
  { nickname: 'User6', points: 9530, profile: 'https://image.blip.kr/v1/file/843689388f56fabb7cb64da9cfbc772f' },
  { nickname: 'User5', points: 1430, profile: 'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfMjM4/MDAxNjA2OTYwMTMwNTIx.WPbCwJi9dPPV9bvYFqNQWOCXBW0cuvxUUV-HlHIrD2kg.Q3IbhhN_ivuL-lxiv-BhOxne1wxBF6mHvTM2Y2wfChYg.GIF.bidsh/17.gif?type=w800' },
];

const popularPostsData = {
  daily: [
    { title: '테스트 일간 인기글 1', author: { nickname: 'User1', profile: 'https://mblogthumb-phinf.pstatic.net/MjAyMTAxMTVfMTQ3/MDAxNjEwNzE1NjI5NDg3.zVoKymGokWDVyo4LR4DGX0hcD0tOhekkrYrQXcFgrvog.j-77qhOAo8HG_hLeeo8PM1UFSZ4UQVpww9sRTX-A-6Qg.JPEG.dltldud33/IMG_8779.JPG?type=w800' } },
    { title: '테스트 일간 인기글 2', author: { nickname: 'User12', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 일간 인기글 3', author: { nickname: 'User13', profile: 'https://example.com/profile3.jpg' } },
    { title: '테스트 일간 인기글 4', author: { nickname: 'User14', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 일간 인기글 5', author: { nickname: 'User15', profile: 'https://media.tenor.com/MPCPvINDMKUAAAAM/%E5%AF%B6%E8%B2%9D%E7%86%8A.gif' } },
  ],
  weekly: [
    { title: '테스트 주간 인기글 1', author: { nickname: 'User11', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 주간 인기글 2', author: { nickname: 'User12', profile: null } },
    { title: '테스트 주간 인기글 3', author: { nickname: 'User13', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 주간 인기글 4', author: { nickname: 'User14', profile: null } },
    { title: '테스트 주간 인기글 5', author: { nickname: 'User15', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
  ],
  monthly: [
    { title: '테스트 월간 인기글 1', author: { nickname: 'User1', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 월간 인기글 2', author: { nickname: 'User1', profile: null } },
    { title: '테스트 월간 인기글 3', author: { nickname: 'User13', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 월간 인기글 4', author: { nickname: 'User14', profile: null } },
    { title: '테스트 월간 인기글 5', author: { nickname: 'User15', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
  ],
  yearly: [
    { title: '테스트 연간 인기글 1', author: { nickname: 'User1', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 연간 인기글 2', author: { nickname: 'User12', profile: null } },
    { title: '테스트 연간 인기글 3', author: { nickname: 'User1', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
    { title: '테스트 연간 인기글 4', author: { nickname: 'User14', profile: null } },
    { title: '테스트 연간 인기글 5', author: { nickname: 'User1', profile: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' } },
  ],
};

const Mainpage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

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
              <li>첫 번째 테스트 공지사항</li>
              <li>두 번째 테스트 공지사항</li>
              <li>세 번째 테스트 공지사항</li>
              <li>네 번째 테스트 공지사항</li>
              <li>다섯 번째 테스트 공지사항</li>
            </ul>
          </div>

          {/* 두 번째 영역 - 인기 게시판 */}
          <div className="section section-with-border">
            <div className="popularity-header">
              <h2>🔥인기</h2>
              <div className="popularity-links">
                <a
                  className={`period-link ${selectedPeriod === 'daily' ? 'selected' : ''}`}
                  onClick={() => handlePeriodChange('daily')}
                >
                  일간
                </a>
                <a
                  className={`period-link ${selectedPeriod === 'weekly' ? 'selected' : ''}`}
                  onClick={() => handlePeriodChange('weekly')}
                >
                  주간
                </a>
                <a
                  className={`period-link ${selectedPeriod === 'monthly' ? 'selected' : ''}`}
                  onClick={() => handlePeriodChange('monthly')}
                >
                  월간
                </a>
                <a
                  className={`period-link ${selectedPeriod === 'yearly' ? 'selected' : ''}`}
                  onClick={() => handlePeriodChange('yearly')}
                >
                  연간
                </a>
              </div>
            </div>
            <ul className="popular-posts">
  {popularPostsData[selectedPeriod].map((post, index) => (
    <li key={index} className="post-item">
      <span className="post-heading">{post.title}</span>
      <span className="post-author">
        <img
          src={post.author.profile || profileImage}
          alt="작성자 프로필"
          style={{ width: '20px', height: '20px', marginRight: '5px', borderRadius: '50%' }}
        />
        {post.author.nickname}
      </span>
    </li>
  ))}
</ul>

          </div>

          {/* 세 번째 영역 - 랭킹 */}
          <div className="section">
            <h2>🏆랭킹</h2>
            <ul className="ranking-list">
              {rankings.map((rank, index) => (
                <li key={index} className="ranking-item">
                  <span>{index + 1}위:</span>
                  <img
                    src={rank.profile || profileImage}
                    alt="프로필"
                    style={{ width: '30px', height: '30px', marginLeft: '10px', marginRight: '10px', borderRadius: '50%' }}
                  />
                  {rank.nickname} - {rank.points} 포인트
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
