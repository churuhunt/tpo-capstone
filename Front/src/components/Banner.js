// Banner.js
import React from 'react';
import './Banner.css';

const Banner = ({ src, title }) => {
    return (
        <div className="banner" style={{ backgroundImage: `url(${src})` }}>
            <h2 className="banner-title">{title}</h2>
        </div>
    );
};

export default Banner;