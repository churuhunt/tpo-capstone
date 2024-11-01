import React, { useState, useEffect } from 'react';
import api from '../axios';
import './Recommendedboard.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

const RecommendationBoard = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date-rise');
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const sortMapping = {
    'date-rise': 'date',
    'date-fall': 'date',
    'likes-rise': 'likes',
    'likes-fall': 'likes',
    'views-rise': 'views',
    'views-fall': 'views'
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts', {
          params: {
            category: '추천게시판',
            searchTerm: searchTerm,
            categoryFilter: filteredCategory,
            sortBy: sortMapping[sortBy] || 'date', // 정렬 기준 매핑
            page: currentPage - 1,
            size: postsPerPage
          }
        });
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('게시물 데이터를 가져오는 데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, currentPage, filteredCategory]);



  const sortPosts = (sortByKey) => {
    let sortedPosts = [...posts];
    switch (sortByKey) {
      case 'date-rise':
        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-fall':
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'likes-rise':
        sortedPosts.sort((a, b) => a.likes - b.likes);
        break;
      case 'likes-fall':
        sortedPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'views-rise':
        sortedPosts.sort((a, b) => a.views - b.views);
        break;
      case 'views-fall':
        sortedPosts.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }
    if (sortByKey === sortBy) {
      sortedPosts.reverse();
      setSortAscending(!sortAscending);
    } else {
      setSortBy(sortByKey);
      setSortAscending(true);
    }
    setPosts(sortedPosts);
  };


  const handleCategoryClick = (category) => {
    setFilteredCategory(category);
  };

  const handleSearch = () => {
    setCurrentPage(1);  // 검색 시 페이지를 1로 초기화
    setLoading(true);
  };

  const handleResetFilter = () => {
    setFilteredCategory('');
    setSearchTerm('');
    setSortBy('date-rise');
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
      <div className="board5-container">
        <h2 onClick={handleResetFilter}>👍추천게시판</h2>
        <div className='board5-container-top'>
          <div className='date'>
            <ul>
              <li><a onClick={() => handleCategoryClick('🗽자유')}>🗽자유게시판</a></li>
              <li><a onClick={() => handleCategoryClick('👖데일리')}>👖데일리룩</a></li>
              <li><a onClick={() => handleCategoryClick('❔질문')}>❔질문게시판</a></li>
              <li><a onClick={() => handleCategoryClick('🎸기타정보')}>🎸기타정보</a></li>
              <li><a onClick={() => handleCategoryClick('💲세일정보')}>💲세일정보</a></li>
              <li><a onClick={() => handleCategoryClick('🕺패션정보')}>🕺패션정보</a></li>
            </ul>
          </div>
          <div className="board5-container search-container">
            <div className="input-group">
              <input
                  type="text"
                  className="form-control"
                  placeholder="검색어를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="board5-select-wrapper">
              <select className="board5-select" onChange={(e) => sortPosts(e.target.value)}>
                <option value="">정렬 기준 선택</option>
                <option value="date-rise">최신순▲</option>
                <option value="date-fall">최신순▼</option>
                <option value="likes-rise">추천순▲</option>
                <option value="likes-fall">추천순▼</option>
                <option value="views-rise">조회수▲</option>
                <option value="views-fall">조회수▼</option>
              </select>
              <span className="board5-select-icon entypo-arrow-combo"></span>
            </div>
          </div>
        </div>
        <table className="board5-container post-table">
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
          {posts.map((post, index) => (
              <tr key={index}>
                <td>{post.category}</td>
                <td>{post.id}</td>
                <td>
                  <Link to={`/postview/${post.id}`} style={{ color: 'black' }}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>{new Date(post.date).toLocaleDateString()}</td> {/* 작성일자 포맷 변경 */}
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
          ))}
          {posts.length < postsPerPage && [...Array(postsPerPage - posts.length)].map((_, index) => (
              <tr key={`empty-${index}`} className="board5-container empty-row">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
          ))}
          </tbody>
        </table>
        <div className="board5-container pagination-write-container">
          <div className="board5-container pagination-container">
            <ul className="board5-container pagination">
              {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
                  <li key={index} className="board5-container page-item">
                    <button onClick={() => paginate(index + 1)} className="board5-container page-link">
                      {index + 1}
                    </button>
                  </li>
              ))}
            </ul>
          </div>
          <div className="board5-container write-button-container">
            <BubblyButton><Link to="/write">글작성</Link></BubblyButton>
          </div>
        </div>
      </div>
  );
}

export default RecommendationBoard;
