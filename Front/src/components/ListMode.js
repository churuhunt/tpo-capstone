import React from 'react';
import './ListMode.css';
import { Link } from 'react-router-dom';

const ListMode = ({ posts }) => {
    const defaultImageUrl = "https://blog-ko.engram.us/content/images/size/w760h400/2023/12/tpo.png";
    return (
        <table className="Post-List-Mode-table">
            <thead>
                <tr>
                    <th>카테고리</th>
                    <th>글번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일자</th>
                    <th>조회수</th>
                    <th>추천수</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post, index) => (
                    <tr key={index}>
                        <td>{post.category}</td>
                        <td>{post.id}</td>
                        <td>
                            <Link to={`/postview/${post.id}`} style={{ color: 'black' }}>{post.title}</Link>
                        </td>
                        <td>
                            <div className="author-info">
                                <img
                                    src={post.profileImageUrl || defaultImageUrl}
                                    alt={`${post.author} 프로필`}
                                    className="profile-image"
                                />
                                <span>{post.author}</span>
                            </div>
                        </td>
                        <td>{new Date(post.date).toLocaleDateString()}</td>
                        <td>{post.views}</td>
                        <td>{post.likes}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ListMode;
