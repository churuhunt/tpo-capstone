import React, { useState, useEffect } from 'react';
import api from '../axios'; // axios를 import 합니다.
import './Popularity.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

const Popularity = () => {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]); // 인기 게시물 상태 추가
  const [sortBy, setSortBy] = useState('likes-rise');
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
        const response = await api.get('/posts', { // 수정된 부분
          params: {
            category: '인기게시판',
            searchTerm: searchTerm,
            categoryFilter: filteredCategory,
            sortBy: sortMapping[sortBy] !== undefined && sortBy ? sortMapping[sortBy] : 'likes',
            page: currentPage - 1,
            size: postsPerPage
          }
        });
        setPosts(response.data.posts || []); // posts가 undefined일 경우 빈 배열로 설정
        setTotalPages(response.data.totalPages);

        // 인기 게시물 필터링
        const popular = response.data.content.filter(post => post.likes >= 10);
        setPopularPosts(popular);
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
              <tr key={index} className={post.likes >= 10 ? 'popular-post' : ''}> {/* 인기 게시물에 클래스 적용 */}
                <td>{post.category}</td>
                <td>{post.id}</td>
                <td>
                  <Link to={`/postview/${post.id}`} style={{color: 'black'}}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>{new Date(post.date).toLocaleDateString()}</td> {/* 작성일자 포맷 변경 */}
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


