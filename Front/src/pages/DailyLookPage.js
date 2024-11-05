import React, { useState, useEffect } from 'react';
import './DailyLookPage.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';
import api from '../axios';
import Banner from '../components/Banner';
import banner1 from '../image/banner1.jpg';

import PageSubMenu from '../components/PageSubMenu'; /*sub*/


// 리스트형, 액자형 아이콘 import
import listViewIcon from '../image/listview.png';
import gridViewIcon from '../image/gridview.png';

const DailyLookPage = () => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState('date-rise');
    const [sortAscending, setSortAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredCategory, setFilteredCategory] = useState(''); // 카테고리 필터링 상태
    const [activeIndex, setActiveIndex] = useState(0); /*sub */
    const menuItems = ["전체", "🗽자유게시판", "👖데일리룩게시판", "❔질문게시판"]; /*sub */


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
                        category: filteredCategory || '데일리룩', // 기본 카테고리 설정
                        searchTerm: searchTerm,
                        sortBy: sortMapping[sortBy] || 'date', // 정렬 기준 매핑
                        ascending: sortAscending ,
                        page: currentPage - 1,
                        size: postsPerPage
                    }
                });
                console.log(response.data); // API 응답 로그
                setPosts(response.data.posts || []); // posts가 undefined일 경우 빈 배열로 설정
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('게시물 데이터를 가져오는 데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [filteredCategory, searchTerm, currentPage]);



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



    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handleCategoryClick = (category) => {
        setFilteredCategory(category === '전체' ? '' : category); // '전체' 클릭 시 카테고리 리셋
        setCurrentPage(1);
    };


    const handleSearch = () => {
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilteredCategory('');
        setSearchTerm('');
        setSortBy('date-rise');
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="board4-container">
            <h2 onClick={handleResetFilter}>💬커뮤니티</h2>
            <div className="banner">
                <h2 className="post-form-title">💬커뮤니티</h2>
            </div>

            <div className="board4-container-top">
                <div className="date">
                    <ul>
                        <li><a onClick={() => handleCategoryClick('자유게시판')}>🗽자유게시판</a></li>
                        <li><a onClick={() => handleCategoryClick('데일리룩')}>👖데일리룩</a></li>
                        <li><a onClick={() => handleCategoryClick('질문게시판')}>❔질문게시판</a></li>
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
                                <Link to={`/postview/${post.id}`} style={{color: 'black'}}>{post.title}</Link>
                            </td>
                            <td>{post.author}</td>
                            <td>{new Date(post.date).toLocaleDateString()}</td>
                            {/* 작성일자 포맷 변경 */}
                            <td>{post.views}</td>
                            <td>{post.likes}</td>
                        </tr>
                    ))}
                    {currentPosts.length < postsPerPage &&
                        [...Array(postsPerPage - currentPosts.length)].map((_, index) => (
                            <tr key={`empty-${index}`} className="board6-container empty-row">
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
            ) : (
                <div className="card-view">
                    {currentPosts.map((post, index) => (
                        <Link to={`/postview/${post.id}`} key={index}> {/* Link 추가 */}
                            <div className="card">
                                <img src={post.thumbnailUrl} alt={`${post.title} 썸네일`} className="thumbnail"/>
                                <div className="card-info">
                                    <h3>{post.title}</h3>
                                    <div className="details">
                                        <div className="author-info">
                                            <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="profile-image"/>
                                            <p>{post.author} 👁️{post.views} 👍{post.likes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="board4-container pagination-write-container">
                <div className="board4-container pagination-container">
                    <ul className="board4-container pagination">
                        {Array.from({length: Math.ceil(posts.length / postsPerPage)}).map((_, index) => (
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

export default DailyLookPage;