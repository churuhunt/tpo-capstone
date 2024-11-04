import React, { useState } from 'react';
import './Guestbook.css';

const Guestbook = () => {
    const [comments, setComments] = useState([
        { 
            id: 1, 
            profileImage: 'https://via.placeholder.com/40', 
            name: 'User1', 
            date: '2023-11-04', 
            content: '방문해주셔서 감사합니다!',
            profileLink: '/user1'
        },
        { 
            id: 2, 
            profileImage: 'https://via.placeholder.com/40', 
            name: 'User2', 
            date: '2023-11-03', 
            content: '좋은 정보 감사합니다. 잘 보고 갑니다!', 
            profileLink: '/user2'
        }
    ]);

    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                {
                    id: comments.length + 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: 'GuestUser',
                    date: new Date().toISOString().split('T')[0],
                    content: newComment,
                    profileLink: '/guestuser'
                },
                ...comments, // 새로운 댓글이 위로 오도록 설정
            ]);
            setNewComment('');
        }
    };

    return (
        <div className="activity-dashboard-guestbook-container">
            <h2 className="activity-dashboard-guestbook-title">방명록</h2>
            <div className="activity-dashboard-guestbook-comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="activity-dashboard-guestbook-comment">
                        <a href={comment.profileLink} className="activity-dashboard-guestbook-comment-profile-link">
                            <img src={comment.profileImage} alt="Profile" className="activity-dashboard-guestbook-comment-profile" />
                        </a>
                        <div className="activity-dashboard-guestbook-comment-content">
                            <div className="activity-dashboard-guestbook-comment-header">
                                <a href={comment.profileLink} className="activity-dashboard-guestbook-comment-name">{comment.name}</a>
                                <span className="activity-dashboard-guestbook-comment-date">{comment.date}</span>
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
