import React from 'react';
import './SortDropdown.css';

const SortDropdown = ({ sortBy, direction, onSortChange }) => {
    return (
        <div className="Sort-select-container">
            <select onChange={onSortChange} value={`${sortBy}-${direction}`}>
                <option value="date-desc">최신순▼</option>
                <option value="date-asc">최신순▲</option>
                <option value="likes-desc">추천순▼</option>
                <option value="likes-asc">추천순▲</option>
                <option value="views-desc">조회수▼</option>
                <option value="views-asc">조회수▲</option>
            </select>
        </div>
    );
};

export default SortDropdown;
