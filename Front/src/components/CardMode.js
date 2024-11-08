import React from 'react';
import { Link } from 'react-router-dom';
import './CardMode.css';

const CardMode = ({ posts }) => {
    const defaultImageUrl = "https://blog-ko.engram.us/content/images/size/w760h400/2023/12/tpo.png";

    return (
        <div className="card-mode-view">
            {posts.map((post, index) => (
                <Link to={`/postview/${post.id}`} key={index}>
                    <div className="card-mode-card">
                        <img
                            src={post.imageUrl || defaultImageUrl}
                            alt={`${post.title} 썸네일`}
                            className="card-mode-thumbnail"
                        />
                        <div className="card-mode-card-info">
                            <h3>{post.title}</h3>
                            <div className="card-mode-details">
                                <div className="card-mode-author-info">
                                    <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="card-mode-profile-image" />
                                    <p>{post.author} 👁️{post.views} 👍{post.likes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CardMode;
