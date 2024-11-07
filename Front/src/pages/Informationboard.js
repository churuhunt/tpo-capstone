import React, { useState, useEffect } from 'react';
import api from '../axios';
import Noticeboard from '../components/Noticeboard';
import { Link } from 'react-router-dom';
import BubblyButton from '../components/BubblyButton';

import banner1 from '../image/infobanner.jpg';
import Banner from '../components/Banner';
import PageSubMenu from '../components/PageSubMenu'; /*sub*/
import ViewModeToggle from '../components/ViewModeToggle';

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

    // 게시물 데이터를 가져오는 useEffect 훅
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true); // 로딩 시작
            try {
                const response = await api.get('/posts', {
                    params: {
                        category: ['정보게시판'], // 정보게시판으로 고정
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
                console.error('정보 게시물 데이터를 가져오는 데 실패했습니다:', error); // 에러 처리
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchPosts(); // 게시물 데이터 가져오기 함수 호출
    }, [debouncedSearchTerm, searchMode, sortBy, direction, currentPage]);

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

    // 소카테고리 변경 핸들러
    const handleSubCategoryChange = (event) => {
        setSubCategoryFilter(event.target.value); // 소카테고리 상태 업데이트
        setCurrentPage(1); // 첫 페이지로 리셋
    };

    // 뷰 모드 변경 핸들러
    const handleViewModeChange = (mode) => {
        setViewMode(mode); // 뷰 모드 상태 업데이트
    };

    // 로딩 중일 경우 로딩 메시지 반환
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // HTML 태그 제거 함수
    const removeHtmlTags = (str) => {
        return str.replace(/<[^>]*>?/gm, ''); // 정규 표현식을 사용하여 HTML 태그 제거
    };

    // 컴포넌트 반환
    return (
        <div className="board4-container">
           <Banner src={banner1} title="ℹ️정보게시판" />
           <div className="post-form-container"> {/*sub*/}
               <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
           </div>

           <ViewModeToggle/>






                          {/* 뷰 모드 전환 버튼 */}
                          <div>
                              <button onClick={() => handleViewModeChange('list')} disabled={viewMode === 'list'}>리스트형 보기</button>
                              <button onClick={() => handleViewModeChange('grid')} disabled={viewMode === 'grid'}>액자형 보기</button>
                          </div>

                          {/* 소카테고리 필터링 드롭다운 */}
                          <select onChange={handleSubCategoryChange} value={subCategoryFilter}>
                              <option value="all">전체</option>
                              <option value="패션정보">패션정보</option>
                              <option value="세일정보">세일정보</option>
                              <option value="기타정보">기타정보</option>
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

export default Informationboard;