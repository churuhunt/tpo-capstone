import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import './PostView.css'; // CSS 파일 불러오기
import profileImage from '../image/profile.png';

const PostDetailView = () => {
    // navigate 함수 가져오기
    const navigate = useNavigate();

    // 임시 데이터 생성
    const tempPost = {
        title: '게시물 제목',
        author: '작성자',
        profilePic: profileImage, // 이미지 경로로 변경
        category: '카테고리',
        likes: 10,
        views: 50,
        content: 'sody',
        date: '2024-06-10',
    };

    // 임시 댓글 데이터 생성
    const tempComments = [
        {
            id: 1,
            author: '댓글 작성자1',
            profilePic: profileImage, // 이미지 경로로 변경
            content: '댓글 내용1',
            date: '2024-06-11',
        },
        {
            id: 2,
            author: '댓글 작성자2',
            profilePic: profileImage, // 이미지 경로로 변경
            content: '댓글 내용2',
            date: '2024-06-12',
        },
        // 다른 댓글 데이터도 추가할 수 있습니다.
    ];

    return (
        <div className="post-container">
            <div className="post-header">
                <h2>{tempPost.title}</h2>
                <div className="button-container">
                    <button className="like-button">추천하기</button>
                    <button className="report-button">신고하기</button>
                </div>
            </div>
            <div className="post-info">
                <div className="left-info">
                    <p>작성일자: {tempPost.date}</p>
                    <p>조회수: {tempPost.views}</p>
                    <p>추천수: {tempPost.likes}</p>
                </div>
                <div className="right-info">
                    <div className="author-info">
                        <img src={tempPost.profilePic} alt="Profile Pic" style={{ width: '50px', height: '50px' }} /> {/* 이미지 사이즈 설정 */}
                        <p>작성자: {tempPost.author}</p>
                    </div>
                </div>
            </div>
            <div className='content-container'>
                <p>{tempPost.content}</p>
            </div>
            <div className="comments">
                <h3>댓글</h3>
                {tempComments.map(comment => (
                    <div className="comment" key={comment.id}>
                        <div className="author-info">
                            <img src={comment.profilePic} alt="Profile Pic" style={{ width: '30px', height: '30px' }} /> {/* 이미지 사이즈 설정 */}
                            <p>{comment.author}</p>
                            <p>{comment.content}</p>
                            <p>{comment.date}</p>
                        </div>
                        <button className="report-button">신고하기</button>
                    </div>
                ))}
            </div>
            <div className="navigation">
                <button className="list-button" onClick={() => navigate(-1)}>목록</button>
            </div>
        </div>
    );
};

export default PostDetailView;
