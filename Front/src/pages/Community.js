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

const Community = () => {
    const [activeIndex, setActiveIndex] = useState(0); /*sub */
    const menuItems = ["🅰️전체", "🗽자유게시판", "👖데일리룩게시판", "❔질문게시판"]; /*sub */
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
    const [subCategoryFilter, setSubCategoryFilter] = useState("all"); // 소카테고리 필터 상태
    const [viewMode, setViewMode] = useState('list'); // 뷰 모드 상태

    // 소카테고리 상태 관리
    const handleSubCategoryChange = (category) => {
        // 메뉴에 따른 필터 값을 명확하게 지정
        if (category === "🅰️전체") {
            setSubCategoryFilter("all"); // 전체 조회
        } else if (category === "🗽자유게시판") {
            setSubCategoryFilter("자유게시판");
        } else if (category === "👖데일리룩게시판") {
            setSubCategoryFilter("데일리룩게시판");
        } else if (category === "❔질문게시판") {
            setSubCategoryFilter("질문게시판");
        }
        console.log("소카테고리 필터 설정됨:", category);
        setCurrentPage(1); // 소카테고리 변경 시 페이지를 첫 페이지로 초기화
    };

    // API 호출 시 동적으로 소카테고리 필터 추가
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/posts', {
                    params: {
                        mainCategories: ['커뮤니티'],
                        smallCategories: subCategoryFilter === 'all' ? null : [subCategoryFilter], // null로 설정하여 전체 조회
                        searchTerm: debouncedSearchTerm,
                        searchMode,
                        sortBy,
                        direction,
                        page: currentPage - 1,
                        size: postsPerPage,
                    },
                    paramsSerializer: params => {
                        return Object.keys(params)
                            .filter(key => params[key] !== null) // null인 경우는 필터링
                            .map(key => Array.isArray(params[key])
                                ? params[key].map(val => `${key}=${val}`).join('&')
                                : `${key}=${params[key]}`
                            ).join('&');
                    }
                });
                console.log("API 응답 데이터:", response.data);
                console.log("소카테고리 필터 상태:", subCategoryFilter); // 현재 필터 상태를 콘솔에 출력
                setPosts(response.data.posts || []);
                setFilteredPosts(response.data.posts || []);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('게시물 데이터를 가져오는 데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [debouncedSearchTerm, searchMode, sortBy, direction, currentPage, subCategoryFilter]);


    // 정렬 기준 변경 핸들러
    const handleSortChange = (event) => {
        const selectedSort = event.target.value;
        const [field, dir] = selectedSort.split('-');
        setSortBy(field);
        setDirection(dir);
        setCurrentPage(1);
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
            {loading && <LoadingModal />}
            <Banner src={banner1} title="💬커뮤니티 게시판" />

            <div className="information-container">
                <PageSubMenu
                    items={menuItems}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    onItemClick={(item, index) => {
                        handleSubCategoryChange(item);
                    }}
                />
            </div>

            <div className="post-head-container">
                <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange}/>
                <SearchBar searchTerm={searchTerm} searchMode={searchMode} onSearchChange={handleSearchChange}
                           onSearchModeChange={handleSearchModeChange} onSearchSubmit={handleSearchSubmit}/>
                <SortDropdown sortBy={sortBy} direction={direction} onSortChange={handleSortChange}/>
            </div>

            <div> {viewMode === 'grid' ? (<ListMode posts={filteredPosts}/>) : (<CardMode posts={filteredPosts}/>)} </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
            <div className="post-button-container">
                <Link to="/write" className="ShadowButton-inline" state={{category: '커뮤니티'}}><ShadowButton>글작성</ShadowButton></Link>
            </div>
        </div>
    );
};

export default Community;