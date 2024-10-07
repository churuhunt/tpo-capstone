import React, { useState } from 'react';
import './community.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

// 리스트형, 액자형 아이콘 import
import listViewIcon from '../image/listview.png';
import gridViewIcon from '../image/gridview.png';

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: '🗽',
      title: '첫 번째 게시물 제목입니다.',
      author: '사용자1',
      date: '2024-09-30',
      views: 100,
      likes: 20,
      thumbnailUrl: 'https://cdn.womentimes.co.kr/news/photo/202302/59638_70323_2522.jpg',
      profileImageUrl: 'https://i.pinimg.com/236x/a5/73/59/a5735920142505068fd1e5ebd0ce86f1.jpg'
    },
    {
      id: 2,
      category: '❔',
      title: '두 번째 게시물 제목입니다.',
      author: '사용자2',
      date: '2024-09-29',
      views: 150,
      likes: 30,
      thumbnailUrl: 'https://sart.ac.kr/upload/20240223/11.jpg',
      profileImageUrl: 'https://i.pinimg.com/236x/6f/16/f1/6f16f17340ba194e07dab3aa5fa9c50a.jpg'
    },
    {
      id: 3,
      category: '👖',
      title: '세 번째 게시물 제목입니다.',
      author: '사용자3',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1BSV8ovPN-dlAht7knagDwZ9HzLcKxXxlMQ&s',
      profileImageUrl: 'https://teenstudio.app/data/board/post/092026150.png'
    },
    {
      id: 4,
      category: '👖',
      title: '네 번째 게시물 제목입니다.',
      author: '사용자4',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://i.pinimg.com/736x/6a/f4/0b/6af40b1d8318adbe38072284f24851b9.jpg',
      profileImageUrl: 'https://teenstudio.app/data/board/post/092026150.png'
    },
    {
      id: 5,
      category: '👖',
      title: '다섯 번째 게시물 제목입니다.',
      author: '사용자5',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://lh4.googleusercontent.com/proxy/bhxz7IOV4t2od7xvn6eZ9ZkxmjPNuD8Tw-lsQpGFJmT74tr2O0wore3YifusQ6Y9s_oQJv63O0zdw0KKMzNJkWwSlMXEJIFpMH4JeJpo',
      profileImageUrl: 'https://teenstudio.app/data/board/post/092026150.png'
    },
    {
      id: 6,
      category: '👖',
      title: '여섯 번째 게시물 제목입니다.',
      author: '사용자6',
      date: '2024-09-28',
      views: 200,
      likes: 40,
      thumbnailUrl: 'https://cdnimage.ebn.co.kr/news/201406/news_1402274122_686153_main1.jpg',
      profileImageUrl: 'https://teenstudio.app/data/board/post/092026150.png'
    }
  ]);

  const [sortBy, setSortBy] = useState('date-rise');
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [viewMode, setViewMode] = useState('card');

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

  const handleCategoryClick = (category) => {
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setSortBy('date-rise');
    setCurrentPage(1);
  };

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
            <img
              src={listViewIcon}
              alt="리스트형 보기"
              className={`view-toggle-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            />
            <img
              src={gridViewIcon}
              alt="액자형 보기"
              className={`view-toggle-icon ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
            />
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
            {currentPosts.length < postsPerPage &&
              [...Array(postsPerPage - currentPosts.length)].map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td colSpan="7" className="empty-row"></td>
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
                <div className="details">
                  <div className="author-info">
                    <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="profile-image" />
                    <p>{post.author}  👁️{post.views} 👍{post.likes}</p>
                  </div>
                </div>
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
