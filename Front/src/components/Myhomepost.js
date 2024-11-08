import React, { useState } from 'react';
import './Myhomepost.css';

const Myhomepost = ({ posts }) => { // Receive posts as a prop
    const [showMore, setShowMore] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const openModal = (image) => {
        setModalImage(image);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    return (
        <div className="myhomepost-container">
            {posts.map((post) => {
                const images = post.images || [];
                return (
                    <div key={post.id} className="myhomepost">
                        <a href={`/postview/${post.id}`} className="myhomepost-title">{post.title}</a>
                        <p className="myhomepost-date">
                            <td>{new Date(post.date).toLocaleDateString()}</td>
                        </p>
                        <div className="myhomepost-content">
                            {showMore || post.content.length <= 100
                                ? (
                                    <div
                                        className="myhomepost-content-html"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                ) : (
                                    <p>{post.content.slice(0, 100)}...</p>
                                )}
                            {post.content.length > 100 && (
                                <button onClick={() => setShowMore(!showMore)} className="myhomepost-show-more">
                                    {showMore ? '닫기' : '더보기'}
                                </button>
                            )}
                        </div>
                        <div className={`myhomepost-images layout-${Math.min(images.length, 6)}`}>
                            {images.slice(0, 6).map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="myhomepost-image"
                                    onClick={() => openModal(image)}
                                />
                            ))}
                            {images.length > 6 && (
                                <div className="myhomepost-more-images">+{images.length - 6}장</div>
                            )}
                        </div>
                        <div className="myhomepost-stats">
                            <span>👍 {post.likes}</span>
                            <span>👁️ {post.views}</span>
                            <span>💬 {post.commentsCount}</span>
                        </div>
                    </div>
                );
            })}

            {modalImage && (
                <div className="myhomepost-modal" onClick={closeModal}>
                    <img src={modalImage} alt="Modal" className="myhomepost-modal-image" />
                </div>
            )}
        </div>
    );
};

export default Myhomepost;
