import React, { useState, useEffect } from 'react';
import './community.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

const Community = () => {
  // 임시 게시물 데이터 추가
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: '자유',
      title: '첫 번째 게시물 제목입니다.',
      author: '사용자1',
      date: '2024-09-30',
      views: 100,
      likes: 20,
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      profileImageUrl: 'https://via.placeholder.com/50' // 임시 프로필 이미지
    },
    {
      id: 2,
      category: '질문',
      title: '두 번째 게시물 제목입니다.',
      author: '사용자2',
      date: '2024-09-29',
      views: 150,
      likes: 30,
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      profileImageUrl: 'https://via.placeholder.com/50' // 임시 프로필 이미지
    },
    {
      id: 3,
      category: '데일리룩',
      title: '세 번째 게시물 제목입니다.',
      author: '사용자3',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      profileImageUrl: 'https://via.placeholder.com/50' // 임시 프로필 이미지
    }
  ]);

  const [sortBy, setSortBy] = useState('date-rise');
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [viewMode, setViewMode] = useState('card'); // 기본값을 카드형으로 설정

  // 게시물 정렬
  const sortPosts = (sortByKey) => {
    if (sortBy === sortByKey) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(sortByKey);
      setSortAscending(true);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 카테고리 필터링
  const handleCategoryClick = (category) => {
    setCurrentPage(1);
  };

  // 검색 시 실행
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 필터 초기화
  const handleResetFilter = () => {
    setSearchTerm('');
    setSortBy('date-rise');
    setCurrentPage(1);
  };

  // 페이지네이션
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="board4-container">
      <h2 onClick={handleResetFilter}>💬커뮤니티</h2>
      <div className="board4-container-top">
        <div className="date">
          <ul>
            <li><a onClick={() => handleCategoryClick('🗽자유')}>🗽자유게시판</a></li>
            <li><a onClick={() => handleCategoryClick('👖데일리')}>👖데일리룩</a></li>
            <li><a onClick={() => handleCategoryClick('❔질문')}>❔질문게시판</a></li>
          </ul>
        </div>
        <div className="board4-container search-container">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="board4-select-wrapper">
            <select className="board4-select" onChange={(e) => sortPosts(e.target.value)}>
              <option value="">정렬 기준 선택</option>
              <option value="date-rise">최신순▲</option>
              <option value="date-fall">최신순▼</option>
              <option value="likes-rise">추천순▲</option>
              <option value="likes-fall">추천순▼</option>
              <option value="views-rise">조회수▲</option>
              <option value="views-fall">조회수▼</option>
            </select>
          </div>
          <div className="view-toggle-container">
            <button 
              className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode('list')}
            >
              리스트형
            </button>
            <button 
              className={`view-toggle-button ${viewMode === 'card' ? 'active' : ''}`} 
              onClick={() => setViewMode('card')}
            >
              액자형
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <table className="board4-container post-table">
          <thead>
            <tr>
              <th>카테고리</th>
              <th>글번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일자</th>
              <th>조회수</th>
              <th>추천수</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post, index) => (
              <tr key={index}>
                <td>{post.category}</td>
                <td>{post.id}</td>
                <td>
                  <Link to={`/postview/${post.id}`} style={{ color: 'black' }}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="card-view">
          {currentPosts.map((post, index) => (
            <div className="card" key={index}>
              <img src={post.thumbnailUrl} alt={`${post.title} 썸네일`} className="thumbnail" />
              <div className="card-info">
                <h3>{post.title}</h3>
                <div className="author-info">
                  <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="profile-image" />
                  <p>{post.author}</p>
                </div>
                <p>조회수: {post.views}</p>
                <p>추천수: {post.likes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="board4-container pagination-write-container">
        <div className="board4-container pagination-container">
          <ul className="board4-container pagination">
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
              <li key={index} className="board4-container page-item">
                <button onClick={() => paginate(index + 1)} className="board4-container page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="board4-container write-button-container">
          <BubblyButton><Link to="/write">글작성</Link></BubblyButton>
        </div>
      </div>
    </div>
  );
};

export default Community;
