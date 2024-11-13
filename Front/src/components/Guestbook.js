import React, { useState, useEffect } from 'react';
import './Guestbook.css';
import api from '../axios';

const Guestbook = ({ comments, setComments, newComment, setNewComment }) => {
    const [loading, setLoading] = useState(false);

    // 댓글 추가 함수
    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                setLoading(true);
                const response = await api.post('/myhome/guestbook/comments', { content: newComment });
                const newCommentData = response.data;

                // 상위 컴포넌트의 comments 상태 업데이트
                setComments((prevComments) => [newCommentData, ...prevComments]);
                setNewComment(''); // 입력 필드 초기화
            } catch (error) {
                console.error('방명록 댓글을 추가하는 중 오류가 발생했습니다:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="activity-dashboard-guestbook-container">
            <h2 className="activity-dashboard-guestbook-title">방명록</h2>
            <div className="activity-dashboard-guestbook-comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="activity-dashboard-guestbook-comment">
                        <a href={`/profile/${comment.userId}`} className="activity-dashboard-guestbook-comment-profile-link">
                            <img src={comment.profileImageUrl || 'https://via.placeholder.com/40'}  alt="Profile" className="activity-dashboard-guestbook-comment-profile" />
                        </a>
                        <div className="activity-dashboard-guestbook-comment-content">
                            <div className="activity-dashboard-guestbook-comment-header">
                                <a href={`/profile/${comment.userId}`} className="activity-dashboard-guestbook-comment-name">{comment.name || 'Unknown User'}</a>
                                <span className="activity-dashboard-guestbook-comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                            </div>
                            <p className="activity-dashboard-guestbook-comment-text">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="activity-dashboard-guestbook-form">
                <textarea
                    className="activity-dashboard-guestbook-textarea"
                    rows="3"
                    placeholder="방명록에 글을 남겨보세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="activity-dashboard-guestbook-submit-button" onClick={handleAddComment}>등록</button>
            </div>
        </div>
    );
};

export default Guestbook;
