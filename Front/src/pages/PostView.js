import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';  // axios로 API 요청
import './PostView.css';
import profileImage from '../image/profile.png';

const PostView = () => {
    const { postId } = useParams();  // URL에서 postId 가져오기
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}`);
                setPost(response.data);
            } catch (error) {
                console.error('게시물을 불러오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchPost();
    }, [postId]);

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) {
            return;
        }

        try {
            const response = await axios.post(`/api/posts/${postId}/comments`, {
                content: commentText,
                author: '현재 사용자 이름',  // 실제 로그인된 사용자 정보 필요
            });
            setComments([...comments, response.data]);
            setCommentText('');
        } catch (error) {
            console.error('댓글 작성 중 오류가 발생했습니다:', error);
        }
    };

    if (!post) {
        return <div>게시물을 불러오는 중입니다...</div>;
    }

    return (
        <div className="post-view-container">
            <h2>{post.title}</h2>
            <p>작성자: {post.author}</p>
            <p>작성일: {new Date(post.date).toLocaleDateString()}</p>
            <p>{post.content}</p>

            <h3>댓글</h3>
            {comments.map((comment, index) => (
                <div key={index}>
                    <p>{comment.author}: {comment.content}</p>
                </div>
            ))}
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요"
            />
            <button onClick={handleCommentSubmit}>댓글 작성</button>

            <button onClick={() => navigate(-1)}>목록으로 돌아가기</button>
        </div>
    );
};

export default PostView;
