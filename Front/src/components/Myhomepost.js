import React, { useState, useEffect } from 'react';
import api from '../axios'; // api 모듈 경로를 설정하세요
import './Myhomepost.css';

const Myhomepost = () => {
    const [posts, setPosts] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/myhome/posts');
                setPosts(response.data || []); // posts가 undefined일 경우 빈 배열로 설정
                console.log(response.data)
            } catch (err) {
                setError("게시물을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserPosts();
    }, []);

    const openModal = (image) => {
        setModalImage(image);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="myhomepost-container">
            {posts.map((post) => {
                const images = post.images || []; // 여기서 images를 초기화
                return (
                    <div key={post.id} className="myhomepost">
                        <a href={`/postview/${post.id}`} className="myhomepost-title">{post.title}</a>
                        <p className="myhomepost-date">
                            <td>{new Date(post.date).toLocaleDateString()}</td>
                        </p>
                        <div className="myhomepost-content">
                            {/* content 길이에 따라 '더보기' 처리 */}
                            {showMore || post.content.length <= 100
                                ? (
                                    <div
                                        className="myhomepost-content-html"
                                        dangerouslySetInnerHTML={{__html: post.content}}
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