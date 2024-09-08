import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios를 import 합니다.
import './Popularity.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

const Popularity = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date-rise');
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts', {
          params: {
            category: '인기게시판',
            searchTerm: searchTerm,
            categoryFilter: filteredCategory,
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
  }, [searchTerm, sortBy, currentPage, filteredCategory]);

  const sortPosts = (sortByKey) => {
    if (sortByKey === sortBy) {
      setSortAscending(!sortAscending);  // 동일 정렬 기준 클릭 시 방향 전환
    } else {
      setSortBy(sortByKey);
      setSortAscending(true); // 새 정렬 기준 설정 시 오름차순으로 시작
    }
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
      <div className="board3-container">
        <h2 onClick={handleResetFilter}>🔥인기게시판</h2>
        <div className='board3-container-top'>
          <div className='date'>
            <ul>
              <li><a onClick={() => handleCategoryClick('😺일간')}>😺일간</a></li>
              <li><a onClick={() => handleCategoryClick('😸주간')}>😸주간</a></li>
              <li><a onClick={() => handleCategoryClick('😹월간')}>😹월간</a></li>
              <li><a onClick={() => handleCategoryClick('😻연간')}>😻연간</a></li>
            </ul>
          </div>
          <div className="board3-container search-container">
            <div className="input-group">
              <input
                  type="text"
                  className="form-control"
                  placeholder="검색어를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="board3-select-wrapper">
              <select className="board3-select" onChange={(e) => sortPosts(e.target.value)}>
                <option value="">정렬 기준 선택</option>
                <option value="date-rise">최신순▲</option>
                <option value="date-fall">최신순▼</option>
                <option value="likes-rise">추천순▲</option>
                <option value="likes-fall">추천순▼</option>
                <option value="views-rise">조회수▲</option>
                <option value="views-fall">조회수▼</option>
              </select>
              <span className="board3-select-icon entypo-arrow-combo"></span>
            </div>
          </div>
        </div>
        <table className="board3-container post-table">
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
                  <Link to="/postview" style={{color: 'black'}}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
          ))}
          {currentPosts.length < postsPerPage && [...Array(postsPerPage - currentPosts.length)].map((_, index) => (
              <tr key={`empty-${index}`} className="board3-container empty-row">
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
        <div className="board3-container pagination-write-container">
          <div className="board3-container pagination-container">
            <ul className="board3-container pagination">
              {Array.from({length: Math.ceil(posts.length / postsPerPage)}).map((_, index) => (
                  <li key={index} className="board3-container page-item">
                    <button onClick={() => paginate(index + 1)} className="board3-container page-link">
                      {index + 1}
                    </button>
                  </li>
              ))}
            </ul>
          </div>
          <div className="board3-container write-button-container">
            <BubblyButton><Link to="/write">글작성</Link></BubblyButton>
          </div>
        </div>
      </div>
  );
};

export default Popularity;


