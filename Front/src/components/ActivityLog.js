import React from 'react';
import './ActivityLog.css';

const ActivityLog = () => {
    // 가상의 댓글 및 게시글 내역 데이터
    const comments = [
        { id: 1, content: '첫 번째 댓글입니다.', date: '2024-06-13' },
        { id: 2, content: '두 번째 댓글입니다.', date: '2024-06-12' },
        { id: 3, content: '세 번째 댓글입니다.', date: '2024-06-11' },
    ];

    const posts = [
        { id: 1, content: '첫 번째 게시글입니다.', date: '2024-06-13' },
        { id: 2, content: '두 번째 게시글입니다.', date: '2024-06-12' },
        { id: 3, content: '세 번째 게시글입니다.', date: '2024-06-11' },
    ];

    return (
        <div className="activity-log-container">
            <h2 className="activity-log-title">활동내역</h2>
            <div className="activity-sections-container">
                <div className="activity-section comments-section">
                    <h3>댓글 내역</h3>
                    <ul className="activity-list">
                        {comments.map(comment => (
                            <li key={comment.id} className="activity-item">
                                <p className="activity-item-content">{comment.content}</p>
                                <p className="activity-item-date">작성일: {comment.date}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="activity-section posts-section">
                    <h3>게시글 내역</h3>
                    <ul className="activity-list">
                        {posts.map(post => (
                            <li key={post.id} className="activity-item">
                                <p className="activity-item-content">{post.content}</p>
                                <p className="activity-item-date">작성일: {post.date}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ActivityLog;
