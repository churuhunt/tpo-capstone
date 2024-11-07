import React, { useState, useEffect } from 'react';
import './FreePage.css';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';
import api from '../axios';
import Banner from '../components/Banner';
import banner1 from '../image/banner1.jpg';

import PageSubMenu from '../components/PageSubMenu'; /*sub*/


// 리스트형, 액자형 아이콘 import
import listViewIcon from '../image/listview.png';
import gridViewIcon from '../image/gridview.png';

const FreePage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [direction, setDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchMode, setSearchMode] = useState('title'); // 검색 모드 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/posts', {
                    params: {
                        category: ['자유게시판', '데일리룩', '질문게시판'], // 배열로 전달
                        searchTerm: debouncedSearchTerm,
                        searchMode,
                        sortBy,
                        direction,
                        page: currentPage - 1,
                        size: postsPerPage,
                    },
                    paramsSerializer: params => {
                        // 배열 파라미터를 서버에서 받을 수 있도록 문자열로 변환
                        return Object.keys(params)
                            .map(key => Array.isArray(params[key]) ? params[key].map(val => `${key}=${val}`).join('&') : `${key}=${params[key]}`)
                            .join('&');
                    }
                });
                setPosts(response.data.posts || []);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('게시물 데이터를 가져오는 데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [debouncedSearchTerm, searchMode, sortBy, direction, currentPage]);

    useEffect(() => {
        if (categoryFilter === 'all') {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(posts.filter((post) => post.category === categoryFilter));
        }
    }, [categoryFilter, posts]);

    const handleSortChange = (event) => {
        const selectedSort = event.target.value;
        const [field, dir] = selectedSort.split('-');
        setSortBy(field);
        setDirection(dir);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setDebouncedSearchTerm(searchTerm); // 검색어 확정 후 디바운싱 없이 즉시 업데이트
        setCurrentPage(1);
    };

    const handleSearchModeChange = (event) => {
        setSearchMode(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    const removeHtmlTags = (str) => {
        return str.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div>
            <h1>게시판</h1>

            {/* 뷰 모드 전환 버튼 */}
            <div>
                <button onClick={() => handleViewModeChange('list')} disabled={viewMode === 'list'}>리스트형 보기</button>
                <button onClick={() => handleViewModeChange('grid')} disabled={viewMode === 'grid'}>액자형 보기</button>
            </div>

            {/* 카테고리 필터링 드롭다운 */}
            <select onChange={handleCategoryChange} value={categoryFilter}>
                <option value="all">전체</option>
                <option value="자유게시판">자유게시판</option>
                <option value="데일리룩">데일리룩</option>
                <option value="질문게시판">질문게시판</option>
            </select>

            {/* 정렬 드롭다운 */}
            <select onChange={handleSortChange} value={`${sortBy}-${direction}`}>
                <option value="date-desc">최신순▼</option>
                <option value="date-asc">최신순▲</option>
                <option value="likes-desc">추천순▼</option>
                <option value="likes-asc">추천순▲</option>
                <option value="views-desc">조회수▼</option>
                <option value="views-asc">조회수▲</option>
            </select>

            {/* 검색 입력 및 모드 선택 */}
            <div>
                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select onChange={handleSearchModeChange} value={searchMode}>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="title_content">제목 + 내용</option>
                </select>
                <button onClick={handleSearchSubmit}>검색</button>
            </div>

            {/* 게시물 목록 */}
            <ul className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
                {filteredPosts.map((post) => (
                    <li key={post.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: '8px' }}>
                        {post.imageUrl && post.imageUrl.startsWith('http') && (
                            <img
                                src={post.imageUrl}
                                alt="게시물 이미지"
                                style={viewMode === 'grid' ? { width: '150px', height: 'auto' } : { width: '100px', height: 'auto' }}
                            />
                        )}
                        <h3>{post.title}</h3>
                        <p>{removeHtmlTags(post.content)}</p>
                        <small>작성자: {post.author}</small>
                        <small>조회수: {post.views}</small>
                        <small>추천수: {post.likes}</small>
                        <small>작성일: {post.date}</small>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션 */}
            <div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={index + 1 === currentPage}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FreePage;