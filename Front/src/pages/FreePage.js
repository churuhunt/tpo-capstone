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
    const [sortBy, setSortBy] = useState('date');
    const [direction, setDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 디바운싱된 검색어
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/posts', {
                    params: {
                        category: '자유게시판',
                        searchTerm: debouncedSearchTerm, // 디바운싱된 검색어 사용
                        sortBy,
                        direction,
                        page: currentPage - 1,
                        size: postsPerPage
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
    }, [debouncedSearchTerm, sortBy, direction, currentPage]);

    // 디바운싱을 위해 searchTerm이 변경되면 일정 시간 후 debouncedSearchTerm을 업데이트
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500); // 0.5초 후에 업데이트

        return () => clearTimeout(timerId); // 컴포넌트가 언마운트되거나 searchTerm이 변경되면 타이머 클리어
    }, [searchTerm]);

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    if (loading) {
        return <div>로딩 중...</div>;
    }

    const removeHtmlTags = (str) => {
        return str.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div>
            <h1>자유게시판</h1>

            <select onChange={handleSortChange} value={`${sortBy}-${direction}`}>
                <option value="date-desc">최신순▼</option>
                <option value="date-asc">최신순▲</option>
                <option value="likes-desc">추천순▼</option>
                <option value="likes-asc">추천순▲</option>
                <option value="views-desc">조회수▼</option>
                <option value="views-asc">조회수▲</option>
            </select>

            <input
                type="text"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        {post.imageUrl && post.imageUrl.startsWith('http') && (
                            <img
                                src={post.imageUrl}
                                alt="게시물 이미지"
                                style={{ width: '100px', height: 'auto' }}
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