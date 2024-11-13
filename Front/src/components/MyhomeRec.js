import React, { useState } from 'react';
import './Myhomepost.css';

const MyhomeRec = ({ recommendedPosts }) => { // Receive posts as a prop
    if (!recommendedPosts || recommendedPosts.length === 0) {
        return <div>추천 게시물이 없습니다.</div>;
    }

    return (
        <div>
            {recommendedPosts.map((post) => (
                <div key={post.id}>
                    {/* 작성자 id(링크용), 작성자 이름, 작성날짜, 글내용, 추천/비추천/신고하기 */}
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
};
export default MyhomeRec;
