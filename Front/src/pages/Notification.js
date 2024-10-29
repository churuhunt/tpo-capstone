import React, { useState, useEffect } from 'react';
import './Notification.css'; 
import { Link } from 'react-router-dom';
import api from '../axios'


const Notification = () => {

  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date-rise');
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [filteredCategory, setFilteredCategory] = useState(''); // 카테고리 필터링 상태


  const sortMapping = {
    'date-rise': 'date',
    'date-fall': 'date',
    'likes-rise': 'likes',
    'likes-fall': 'likes',
    'views-rise': 'views',
    'views-fall': 'views'
  };

  // 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // 로딩 상태 초기화
      try {
        const response = await api.get('/posts', { // 수정된 부분
          params: {
            category: filteredCategory || '공지사항',
            searchTerm: searchTerm,
            sortBy: sortMapping[sortBy] || 'date', // 정렬 기준 매핑
            ascending: sortAscending ,
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


  useEffect(() => {
    sortPosts(sortBy);
  }, [sortBy]);

  useEffect(() => {
    filterPosts();
  }, [searchTerm]);

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

  const filterPosts = () => {
    const filteredPosts = initialPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPosts(filteredPosts);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    filterPosts();
  };

  const handleResetFilter = () => {
    setPosts(initialPosts);
    setSearchTerm('');
    setSortBy('date-rise');
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="board2-container">
      <h2 onClick={handleResetFilter}>📢공지사항</h2>
      <div className='board2-container-top'>
        <div className="board2-container search-container">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="board2-select-wrapper">
            <select className="board2-select" onChange={(e) => sortPosts(e.target.value)}>
              <option value="">정렬 기준 선택</option>
              <option value="date-rise">최신순▲</option>
              <option value="date-fall">최신순▼</option>
              <option value="likes-rise">추천순▲</option>
              <option value="likes-fall">추천순▼</option>
              <option value="views-rise">조회수▲</option>
              <option value="views-fall">조회수▼</option>
            </select>
            <span className="board2-select-icon entypo-arrow-combo"></span>
          </div>
        </div>
      </div>
      <table className="board2-container post-table">
        <thead>
          <tr>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성일자</th>
            <th>조회수</th>
            <th>추천수</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr key={index}>
              <td>{post.category}</td> {/* 카테고리 표시 */}
              <td>
                <Link to="/postview" style={{ color: 'black' }}>{post.title}</Link>
              </td>
              <td>{post.date}</td>
              <td>{post.views}</td>
              <td>{post.likes}</td>
            </tr>
          ))}
          {currentPosts.length < postsPerPage && [...Array(postsPerPage - currentPosts.length)].map((_, index) => (
            <tr key={`empty-${index}`} className="board2-container empty-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="board2-container pagination-write-container">
        <div className="board2-container pagination-container">
          <ul className="board2-container pagination">
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
              <li key={index} className="board2-container page-item">
                <button onClick={() => paginate(index + 1)} className="board2-container page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notification;
