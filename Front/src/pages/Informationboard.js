import React, { useState, useEffect } from 'react';
import api from '../axios';
import { Link } from 'react-router-dom';
import './Informationboard.css';
import LoadingModal from '../components/LoadingModal';

import banner1 from '../image/infobanner.jpg';
import Banner from '../components/Banner';
import PageSubMenu from '../components/PageSubMenu';
import ViewModeToggle from '../components/ViewModeToggle';
import SortDropdown from '../components/SortDropdown';
import SearchBar from '../components/SearchBar';
import ListMode from '../components/ListMode';
import CardMode from '../components/CardMode';
import Pagination from '../components/Pagination';
import ShadowButton from '../components/ShadowButton';

const Informationboard = () => {
    const [activeIndex, setActiveIndex] = useState(0); /*sub */
    const menuItems = ["🅰️전체", "🕺패션정보", "💲세일정보", "🎸기타정보"]; /*sub */
    const [posts, setPosts] = useState([]); // 전체 정보 게시물 목록
    const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 정보 게시물 목록
    const [sortBy, setSortBy] = useState('date'); // 정렬 기준
    const [direction, setDirection] = useState('desc'); // 정렬 방향
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 디바운스 검색어 상태
    const [searchMode, setSearchMode] = useState('title'); // 검색 모드 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postsPerPage] = useState(15); // 페이지당 게시물 수
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [subCategoryFilter, setSubCategoryFilter] = useState('all'); // 소카테고리 필터 상태
    const [viewMode, setViewMode] = useState('list'); // 뷰 모드 상태

    // 소카테고리 변경 핸들러
    const handleSubCategoryChange = (category) => {
        // 메뉴에 따른 필터 값을 명확하게 지정
        if (category === "🅰️전체") {
            setSubCategoryFilter("all"); // 전체 조회
        } else if (category === "🕺패션정보") {
            setSubCategoryFilter("패션정보");
        } else if (category === "💲세일정보") {
            setSubCategoryFilter("세일정보");
        } else if (category === "🎸기타정보") {
            setSubCategoryFilter("기타정보");
        }
        console.log("소카테고리 필터 설정됨:", category);
        setCurrentPage(1); // 소카테고리 변경 시 페이지를 첫 페이지로 초기화
    };
    // 게시물 데이터를 가져오는 useEffect 훅
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true); // 로딩 시작
            try {
                const response = await api.get('/posts', {
                    params: {
                        mainCategories: ['정보'], // mainCategory를 정보게시판으로 고정
                        smallCategories: subCategoryFilter === 'all' ? null : [subCategoryFilter], // 선택한 소카테고리만
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
                setPosts(response.data.posts || []); // 응답 데이터에서 게시물 목록 설정
                setTotalPages(response.data.totalPages); // 총 페이지 수 설정
            } catch (error) {
                console.error('게시물 데이터를 가져오는 데 실패했습니다:', error); // 에러 처리
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchPosts(); // 게시물 데이터 가져오기 함수 호출
    }, [debouncedSearchTerm, searchMode, sortBy, direction, currentPage, subCategoryFilter]);


    // posts 상태가 변경될 때 filteredPosts 상태 업데이트
    useEffect(() => {
        if (subCategoryFilter === 'all') {
            setFilteredPosts(posts); // 전체 게시물을 필터링된 게시물로 설정
        } else {
            setFilteredPosts(posts.filter((post) => post.smallCategory === subCategoryFilter)); // 소카테고리 필터링
        }
    }, [subCategoryFilter, posts]);

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
            {loading && <LoadingModal />}

            {/* 배너 */}
            <Banner src={banner1} title="ℹ️정보 게시판" />

            {/* 서브 메뉴 */}
            <div className="information-container">
                <PageSubMenu
                    items={menuItems}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    onItemClick={(item, index) => handleSubCategoryChange(item)}
                />
            </div>

            {/* 나머지 UI (뷰 전환, 검색, 정렬, 페이징, 게시물 목록) */}
            <div className="post-head-container">
                <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
                <SearchBar searchTerm={searchTerm} searchMode={searchMode} onSearchChange={handleSearchChange} onSearchModeChange={handleSearchModeChange} onSearchSubmit={handleSearchSubmit} />
                <SortDropdown sortBy={sortBy} direction={direction} onSortChange={handleSortChange} />
            </div>

            <div>
                {viewMode === 'list' ? <ListMode posts={filteredPosts} /> : <CardMode posts={filteredPosts} />}
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            <div className="post-button-container">
                <Link to="/write" className="ShadowButton-inline" state={{ category: '정보게시판' }}><ShadowButton>글작성</ShadowButton></Link>
            </div>

        </div>
    );
};

export default Informationboard;