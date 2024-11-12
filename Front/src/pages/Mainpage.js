import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Mainpage.css';
import profileImage from '../image/profile.png';
import api from '../axios';

import mainimg1 from '../image/mainimg1.jpg';
import mainimg2 from '../image/mainimg2.jpg';
import mainimg3 from '../image/mainimg3.jpg';

import mainbanner1 from '../image/mainpage-banner1.jpg';
import mainbanner2 from '../image/mainpage-banner2.jpg';
import mainbanner3 from '../image/mainpage-banner3.jpg';
import LoadingModal from '../components/LoadingModal';
import PageSubMenu from '../components/PageSubMenu';
import { Link } from 'react-router-dom';

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
  const [cachedPosts, setCachedPosts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 로딩 시작
        setLoading(true);

        // 비동기 요청 병렬 처리
        const [communityResponse, announcementResponse, rankingResponse, ...popularResponses] = await Promise.all([
          api.get('/posts', {
            params: { category: ['자유게시판'], page: 0, size: 5 },
            paramsSerializer: params => Object.keys(params)
              .map(key => Array.isArray(params[key]) ? params[key].map(val => `${key}=${encodeURIComponent(val)}`).join('&') : `${key}=${encodeURIComponent(params[key])}`)
              .join('&')
          }),
          api.get('/posts', {
            params: { category: ['공지사항'], page: 0, size: 5 },
            paramsSerializer: params => Object.keys(params)
              .map(key => Array.isArray(params[key]) ? params[key].map(val => `${key}=${encodeURIComponent(val)}`).join('&') : `${key}=${encodeURIComponent(params[key])}`)
              .join('&')
          }),
          api.get('/rankings/total'),
          ...['daily', 'weekly', 'monthly', 'yearly'].map(period =>
            api.get('/posts', {
              params: { likes: 10, sortBy: 'likes', direction: 'desc', page: 0, size: 5, timeFilter: period }
            })
          )
        ]);

        // 응답 데이터 설정
        setCommunityPosts(communityResponse.data.posts || []);
        setAnnouncements(announcementResponse.data.posts || []);
        setRankings(rankingResponse.data);

        // 캐시 데이터 설정 및 초기 인기 게시물 설정
        const newCachedPosts = {
          daily: popularResponses[0].data.posts || [],
          weekly: popularResponses[1].data.posts || [],
          monthly: popularResponses[2].data.posts || [],
          yearly: popularResponses[3].data.posts || []
        };
        setCachedPosts(newCachedPosts);
        setPopularPosts(newCachedPosts[selectedPeriod]);

      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        // 로딩 종료
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    const handlePeriodChange = (period) => {
      setSelectedPeriod(period);
      setPopularPosts(cachedPosts[period]); // 캐시된 데이터 사용
    };

  return (
    <div className="main-page">
      {/* 로딩 상태가 true일 경우 로딩 컴포넌트 표시 */}
      {loading ? (
        <LoadingModal />
      ) : (
        <>
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
                  {announcements.slice(0, 5).map((announcement, index) => (
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
                  {popularPosts.slice(0, 5).map((post, index) => (
                    <li key={index} className="post-item">
                      <img
                        src={post.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwpSuPwVevZxk9WHC04FSWZqscJudpoQhFzw&s"}
                        alt="포스트 썸네일"
                        className="post-thumbnail"
                      />
                      <div className="post-content">
                        <Link to={`/postview/${post.id}`} className="post-title-link">
                          <span className="post-title">{post.title}</span>
                        </Link>
                      </div>
                      <div className="post-author">
                        <img
                          src={post.profileImageUrl || profileImage}
                          alt="작성자 프로필"
                          className="author-profile"
                        />
                        <span>{post.author.nickname}</span>
                      </div>
                    </li>
                  ))}
                </ul>



              </div>

              {/* 랭킹 섹션 */}
              <div className="section">
                <h2>🏆랭킹</h2>
                <ul className="ranking-list">
                  {rankings.slice(0, 5).map((rank, index) => (
                    <li key={index} className="ranking-item">
                      <span>{rankEmojis[index] || `${index + 1}위`}</span>
                      <Link to={`/mymenu/${rank.id}`}>
                        <img src={rank.profileImageUrl || profileImage} alt="프로필" className="profile-image" />
                      </Link>
                      <Link to={`/mymenu/${rank.id}`} className="ranking-nickname" >
                        {rank.nickname}
                      </Link>
                      <span className="ranking-points">{rank.points} 포인트</span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Mainpage;
