import React from 'react';
import './Pagination.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pageLimit = 5; // 한 번에 표시할 페이지 버튼 수
    const totalButtons = Math.min(totalPages, pageLimit);
    const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    const endPage = Math.min(totalPages, startPage + totalButtons - 1);

    // 페이지 버튼을 배열로 생성
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // 이전 페이지와 다음 페이지 핸들러
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="pagination-container">
            {currentPage > 1 && (
                <button onClick={handlePrevious}>&laquo;</button>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}

            {currentPage < totalPages && (
                <button onClick={handleNext}>&raquo;</button>
            )}
        </div>
    );
};

export default Pagination;
