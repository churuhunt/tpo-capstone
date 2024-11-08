import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, searchMode, onSearchChange, onSearchModeChange, onSearchSubmit }) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearchSubmit(); // 엔터 키가 눌리면 검색 실행
        }
    };

    return (
        <div className="search-bar">
            <select className="search-bar-select" onChange={onSearchModeChange} value={searchMode}>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="title_content">제목 + 내용</option>
            </select>
            <input
                type="text"
                className="search-bar-input"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={onSearchChange}
                onKeyPress={handleKeyPress} // 엔터 키 감지 이벤트
            />
        </div>
    );
};

export default SearchBar;
