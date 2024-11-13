import React, { useState, useEffect } from 'react';
import api from '../axios';
import { Link } from 'react-router-dom';
import './Informationboard.css';
import LoadingModal from '../components/LoadingModal';

import banner1 from '../image/banner1.jpg';
import Banner from '../components/Banner';
import PageSubMenu from '../components/PageSubMenu';
import ViewModeToggle from '../components/ViewModeToggle';
import SortDropdown from '../components/SortDropdown';
import SearchBar from '../components/SearchBar';
import ListMode from '../components/ListMode';
import CardMode from '../components/CardMode';
import Pagination from '../components/Pagination';
import ShadowButton from '../components/ShadowButton';

const QuestionsPage = () => {
    const [posts, setPosts] = useState([]); // 전체 질문 게시물 목록
    const [sortBy, setSortBy] = useState('date'); // 정렬 기준
    const [direction, setDirection] = useState('desc'); // 정렬 방향
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 디바운스 검색어 상태
    const [searchMode, setSearchMode] = useState('title'); // 검색 모드 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postsPerPage] = useState(15); // 페이지당 게시물 수
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [viewMode, setViewMode] = useState('list'); // 뷰 모드 상태

    // 게시물 데이터를 가져오는 useEffect 훅
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true); // 로딩 시작
            try {
                const response = await api.get('/posts', {
                    params: {
                        mainCategories: ['커뮤니티'], // 메인 카테고리를 '커뮤니티'로 설정
                        smallCategories: ['질문게시판'], // 소카테고리를 '질문게시판'으로 설정
                        searchTerm: debouncedSearchTerm,
                        searchMode,
                        sortBy,
                        direction,
                        page: currentPage - 1,
                        size: postsPerPage,
                    },
                    paramsSerializer: params => {
                        return Object.keys(params)
                            .map(key => Array.isArray(params[key]) ? params[key].map(val => `${key}=${val}`).join('&') : `${key}=${params[key]}`)
                            .join('&');
                    }
                });
                setPosts(response.data.posts || []); // 응답 데이터에서 게시물 목록 설정
                setTotalPages(response.data.totalPages); // 총 페이지 수 설정
            } catch (error) {
                console.error('게시물 데이터를 가져오는 데 실패했습니다:', error); // 에러 처리
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchPosts(); // 게시물 데이터 가져오기 함수 호출
    }, [debouncedSearchTerm, searchMode, sortBy, direction, currentPage]);

    // 정렬 기준 변경 핸들러
    const handleSortChange = (event) => {
        const selectedSort = event.target.value; // 선택한 정렬 기준
        const [field, dir] = selectedSort.split('-'); // 필드와 방향 분리
        setSortBy(field); // 정렬 기준 업데이트
        setDirection(dir); // 정렬 방향 업데이트
        setCurrentPage(1); // 첫 페이지로 리셋
    };

    // 검색 입력 변경 핸들러
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // 검색어 상태 업데이트
    };

    // 검색 제출 핸들러
    const handleSearchSubmit = () => {
        setDebouncedSearchTerm(searchTerm); // 검색어 확정 후 디바운싱 없이 즉시 업데이트
        setCurrentPage(1); // 첫 페이지로 리셋
    };

    // 검색 모드 변경 핸들러
    const handleSearchModeChange = (event) => {
        setSearchMode(event.target.value); // 검색 모드 상태 업데이트
    };

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page); // 현재 페이지 상태 업데이트
    };

    // 뷰 모드 변경 핸들러
    const handleViewModeChange = (mode) => {
        setViewMode(mode); // 뷰 모드 상태 업데이트
    };

    // HTML 태그 제거 함수
    const removeHtmlTags = (str) => {
        return str.replace(/<[^>]*>?/gm, ''); // 정규 표현식을 사용하여 HTML 태그 제거
    };

    // 컴포넌트 반환
    return (
        <div className="informationboard-container">

            {/* 로딩 */}
            {loading && <LoadingModal/>}

            {/* 배너 */}
            <Banner src={banner1} title="❔질문게시판" />

            <div className="post-head-container">
                {/* 뷰 전환 버튼 컴포넌트 */}
                <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />

                {/* 검색창 컴포넌트 */}
                <SearchBar searchTerm={searchTerm} searchMode={searchMode} onSearchChange={handleSearchChange} onSearchModeChange={handleSearchModeChange} onSearchSubmit={handleSearchSubmit} />

                {/* 정렬 컴포넌트 */}
                <SortDropdown sortBy={sortBy} direction={direction} onSortChange={handleSortChange} />
            </div>

            {/* 게시글 (리스트/액자형) 컴포넌트 */}
            <div>{viewMode === 'list' ? <ListMode posts={posts} /> : <CardMode posts={posts} />}</div>

            {/* 페이징 컴포넌트 */}
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

            {/* 글작성 버튼 컴포넌트 */}
            <div className="post-button-container">
                <Link to="/write" className="ShadowButton-inline" state={{ category: '커뮤니티' }}>
                    <ShadowButton>글작성</ShadowButton>
                </Link>
            </div>
        </div>
    );
};

export default QuestionsPage;