import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './community.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date-rise');
  const [sortAscending, setSortAscending] = useState(true); // 정렬 반전 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredCategory, setFilteredCategory] = useState(''); // 카테고리 필터링 상태

  // 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts', {
          params: {
            category: filteredCategory || '커뮤니티',
            searchTerm: searchTerm,
            sortBy: sortBy,
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
  }, [filteredCategory, searchTerm, sortBy, currentPage]);

  // 게시물 정렬
  const sortPosts = (sortByKey) => {
    if (sortBy === sortByKey) {
      setSortAscending(!sortAscending); // 동일한 정렬 기준 클릭 시 반전
    } else {
      setSortBy(sortByKey);
      setSortAscending(true); // 새로운 정렬 기준 클릭 시 오름차순으로 설정
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 카테고리 필터링
  const handleCategoryClick = (category) => {
    setFilteredCategory(category);
    setCurrentPage(1); // 페이지 초기화
  };

  // 검색 시 실행
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 필터 초기화
  const handleResetFilter = () => {
    setFilteredCategory('');
    setSearchTerm('');
    setSortBy('date-rise');
    setCurrentPage(1);
  };

  // 페이지네이션
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
      <div className="board4-container">
        <h2 onClick={handleResetFilter}>💬커뮤니티</h2>
        <div className='board4-container-top'>
          <div className='date'>
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
              <span className="board4-select-icon entypo-arrow-combo"></span>
            </div>
          </div>
        </div>
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
                  <Link to={'/postview/${post.id}'} style={{ color: 'black' }}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
          ))}
          {currentPosts.length < postsPerPage && [...Array(postsPerPage - currentPosts.length)].map((_, index) => (
              <tr key={`empty-${index}`} className="board4-container empty-row">
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
}

export default Community;
