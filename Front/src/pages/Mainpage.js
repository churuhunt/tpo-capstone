import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Mainpage.css';
import profileImage from '../image/profile.png'; // 기본 프로필 이미지
import api from '../axios';

import mainimg1 from '../image/mainimg1.jpg';
import mainimg2 from '../image/mainimg2.jpg';
import mainimg3 from '../image/mainimg3.jpg';

import mainbanner1 from '../image/mainpage-banner1.jpg';
import mainbanner2 from '../image/mainpage-banner2.jpg';
import mainbanner3 from '../image/mainpage-banner3.jpg';

import PageSubMenu from '../components/PageSubMenu';

const slideImages = [mainimg1, mainimg2, mainimg3];
const slideBanners = [mainbanner1, mainbanner2, mainbanner3];
const rankEmojis = ['🥇', '🥈', '🥉', '🏅', '🏅'];


const Mainpage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [rankings, setRankings] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 자유게시판 데이터 가져오기
        const communityResponse = await api.get('/posts', {
          params: {
            category: ['자유게시판'],
            page: 0,
            size: 5
          }
        });
        setCommunityPosts(communityResponse.data.posts || []);

        // 공지사항 데이터 가져오기
        const announcementResponse = await api.get('/posts', {
          params: {
            category: ['공지사항'],
            page: 0,
            size: 5
          }
        });
        setAnnouncements(announcementResponse.data.posts || []);

        // 인기 게시물 데이터 가져오기
        const popularResponse = await api.get('/posts', {
          params: {
            likes: 10,
            sortBy: 'likes',
            direction: 'desc',
            page: 0,
            size: 5,
            timeFilter: selectedPeriod
          }
        });
        setPopularPosts(popularResponse.data.posts || []);

        // 랭킹 데이터 가져오기
        const rankingResponse = await api.get('/api/rankings/total');
        setRankings(rankingResponse.data);

      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const handlePeriodChange = (period) => setSelectedPeriod(period);

  return (
    <div className="main-page">
      <div className="banner-slideshow">
        <Slide easing="ease">
          {slideBanners.map((image, index) => (
            <div className="main-page-banner" key={index} style={{ backgroundImage: `url(${image})` }} />
          ))}
        </Slide>
      </div>

      <div className="content">
        <PageSubMenu items={[]} activeIndex={0} setActiveIndex={() => {}} />

        <div className="sections-container">
          {/* 공지사항 섹션 */}
          <div className="section">
            <h2>📢 공지사항</h2>
            <ul>
              {announcements.map((announcement, index) => (
                <li key={index} className="announcement-item">
                  <span className="announcement-title">{announcement.title}</span>
                  <span className="announcement-date">{announcement.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 인기 게시판 섹션 */}
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
              {popularPosts.map((post, index) => (
                <li key={index} className="post-item">
                  <img
                    src={post.thumbnail}
                    alt="포스트 썸네일"
                    className="post-thumbnail"
                  />
                  <div className="post-content">
                    <span className="post-title">{post.title}</span>
                    <div className="post-author">
                      <img
                        src={post.author.profile || profileImage}
                        alt="작성자 프로필"
                        className="author-profile"
                      />
                      {post.author.nickname}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 랭킹 섹션 */}
          <div className="section">
            <h2>🏆랭킹</h2>
            <ul className="ranking-list">
              {rankings.map((rank, index) => (
                <li key={index} className="ranking-item">
                  <span>{rankEmojis[index] || `${index + 1}위`}</span>
                  <img src={rank.profile || profileImage} alt="프로필" className="profile-image" />
                  <span className="ranking-nickname">{rank.nickname}</span>
                  <span className="ranking-points">{rank.points} 포인트</span>
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
