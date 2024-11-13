import React, { useState, useEffect } from 'react';
import api from "../axios";


const MyhomeRec = () => {
    const [bookmarks, setBookmarks] = useState([]); // 초기값을 빈 배열로 설정
    const [showMore, setShowMore] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        // 북마크된 게시글을 가져옵니다
        const fetchBookmarks = async () => {
            try {
                const response = await api.get('/myhome/bookmarks');
                setBookmarks(response.data || []);
            } catch (error) {
                console.error('북마크를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchBookmarks();
    }, []);

    const openModal = (image) => {
        setModalImage(image);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    return (
        <div className="myhomebookmark-container">
            {Array.isArray(bookmarks) && bookmarks.length > 0 ? ( // 조건부 렌더링
                bookmarks.map((post) => {
                    const images = post.images || [];
                    return (
                        <div key={post.id} className="myhomebookmark">
                            <a href={`/postview/${post.id}`} className="myhomebookmark-title">{post.title}</a>
                            <p className="myhomebookmark-date">
                                <td>{new Date(post.date).toLocaleDateString()}</td>
                            </p>
                            <div className="myhomebookmark-content">
                                {showMore || post.content.length <= 100
                                    ? (
                                        <div
                                            className="myhomebookmark-content-html"
                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                        />
                                    ) : (
                                        <p>{post.content.slice(0, 100)}...</p>
                                    )}
                                {post.content.length > 100 && (
                                    <button onClick={() => setShowMore(!showMore)} className="myhomebookmark-show-more">
                                        {showMore ? '닫기' : '더보기'}
                                    </button>
                                )}
                            </div>
                            <div className={`myhomebookmark-images layout-${Math.min(images.length, 6)}`}>
                                {images.slice(0, 6).map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Post image ${index + 1}`}
                                        className="myhomebookmark-image"
                                        onClick={() => openModal(image)}
                                    />
                                ))}
                                {images.length > 6 && (
                                    <div className="myhomebookmark-more-images">+{images.length - 6}장</div>
                                )}
                            </div>
                            <div className="myhomebookmark-stats">
                                <span>👍 {post.likes}</span>
                                <span>👁️ {post.views}</span>
                                <span>💬 {post.commentsCount}</span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>북마크된 게시글이 없습니다.</p>
            )}

            {modalImage && (
                <div className="myhomebookmark-modal" onClick={closeModal}>
                    <img src={modalImage} alt="Modal" className="myhomebookmark-modal-image" />
                </div>
            )}
        </div>
    );
};

export default MyhomeRec;