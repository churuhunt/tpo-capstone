import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios'; // axios 인스턴스 설정
import BubblyButton from '../components/BubblyButton';
import './Noticeboard.css';

import listViewIcon from '../image/listview.png';
import gridViewIcon from '../image/gridview.png';

const Noticeboard = ({ postsPerPage = 15 }) => {
    const [posts, setPosts] = useState([]);
    const [NoticeboardViewMode, setNoticeboardViewMode] = useState('card');
    const [NoticeboardSearchTerm, setNoticeboardSearchTerm] = useState('');
    const [NoticeboardCurrentPage, setNoticeboardCurrentPage] = useState(1);
    const [NoticeboardSortBy, setNoticeboardSortBy] = useState('date-rise');
    const [NoticeboardSortAscending, setNoticeboardSortAscending] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts();
    }, [NoticeboardSearchTerm, NoticeboardSortBy, NoticeboardSortAscending, NoticeboardCurrentPage]);

    // Fetch posts from backend based on current filter and sort criteria
    const fetchPosts = async () => {
        try {
            const response = await api.get('/api/posts', {
                params: {
                    searchTerm: NoticeboardSearchTerm,
                    page: NoticeboardCurrentPage - 1, // 페이지 번호 조정 (0부터 시작)
                    size: postsPerPage,
                    sortBy: NoticeboardSortBy,
                },
            });
            setPosts(response.data.posts); // 백엔드 응답의 posts 배열
            setTotalPages(response.data.totalPages); // 전체 페이지 수
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    // 핸들 정렬 함수
    const NoticeboardSortPosts = (sortByKey) => {
        if (NoticeboardSortBy === sortByKey) {
            setNoticeboardSortAscending(!NoticeboardSortAscending);
        } else {
            setNoticeboardSortBy(sortByKey);
            setNoticeboardSortAscending(true);
        }
    };

    const indexOfLastPost = NoticeboardCurrentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const NoticeboardCurrentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const NoticeboardPaginate = (pageNumber) => {
        setNoticeboardCurrentPage(pageNumber);
    };

    return (
        <div className="Noticeboard-container">
            <div className="Noticeboard-top">
                <div className="Noticeboard-view-toggle-container">
                    <img
                        src={listViewIcon} // 리스트형 보기 아이콘 이미지 경로
                        alt="리스트형 보기"
                        className={`Noticeboard-view-toggle-icon ${NoticeboardViewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setNoticeboardViewMode('list')}
                    />
                    <img
                        src={gridViewIcon} // 액자형 보기 아이콘 이미지 경로
                        alt="액자형 보기"
                        className={`Noticeboard-view-toggle-icon ${NoticeboardViewMode === 'card' ? 'active' : ''}`}
                        onClick={() => setNoticeboardViewMode('card')}
                    />
                </div>
                <div className="Noticeboard-input-group">
                    <input
                        type="text"
                        className="Noticeboard-form-control"
                        placeholder="검색어를 입력하세요..."
                        value={NoticeboardSearchTerm}
                        onChange={(e) => setNoticeboardSearchTerm(e.target.value)}
                    />
                </div>
                <div className="Noticeboard-sort-select-wrapper">
                    <select
                        className="Noticeboard-sort-select"
                        onChange={(e) => NoticeboardSortPosts(e.target.value)}
                    >
                        <option value="">정렬 기준 선택</option>
                        <option value="date-rise">최신순▲</option>
                        <option value="date-fall">최신순▼</option>
                        <option value="likes-rise">추천순▲</option>
                        <option value="likes-fall">추천순▼</option>
                        <option value="views-rise">조회수▲</option>
                        <option value="views-fall">조회수▼</option>
                    </select>
                </div>
            </div>

            {NoticeboardViewMode === 'list' ? (
                <table className="Noticeboard-post-table">
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
                    {NoticeboardCurrentPosts.map((post, index) => (
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
                <div className="Noticeboard-card-view">
                    {NoticeboardCurrentPosts.map((post, index) => (
                        <Link to={`/postview/${post.id}`} key={index}>
                            <div className="Noticeboard-card">
                                <img src={post.thumbnailUrl} alt={`${post.title} 썸네일`} className="Noticeboard-thumbnail" />
                                <div className="Noticeboard-card-info">
                                    <h3>{post.title}</h3>
                                    <div className="Noticeboard-details">
                                        <div className="Noticeboard-author-info">
                                            <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="Noticeboard-profile-image" />
                                            <p>{post.author} 👁️{post.views} 👍{post.likes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="Noticeboard-pagination-write-container">
                <div className="Noticeboard-pagination-container">
                    <ul className="Noticeboard-pagination">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <li key={index} className="Noticeboard-page-item">
                                <button
                                    onClick={() => NoticeboardPaginate(index + 1)}
                                    className="Noticeboard-page-link"
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="Noticeboard-write-button-container">
                    <BubblyButton>
                        <Link
                            to="/write"
                            style={{
                                color: '#fff',
                                textDecoration: 'none'
                            }}
                        >
                            글작성
                        </Link>
                    </BubblyButton>
                </div>
            </div>
        </div>
    );
};

export default Noticeboard;