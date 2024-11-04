import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="error-page-wrapper">
            <div className="error-page-container">
                <h1 data-h1="404">404</h1>
                <p data-p="NOT FOUND">Coming Soon</p>
                <a href="#" className="error-page-back">돌아가기</a>
            </div>
        </div>
    );
};

export default ErrorPage;