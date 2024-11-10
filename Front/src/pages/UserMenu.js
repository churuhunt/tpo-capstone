import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 userId를 가져오기 위해 사용
import api from '../axios';
import LoadingModal from '../components/LoadingModal';
import PageSubMenu from '../components/PageSubMenu';
import Visithistory from '../components/Visithistory';
import Myhomepost from '../components/Myhomepost';
import ActivityDashboard from '../components/ActivityDashboard';
import Guestbook from '../components/Guestbook';
import FriendList from '../components/FriendList';
import './Mymenu.css';

const UserMenu = () => {
    const { userId } = useParams(); // URL에서 userId 파라미터 추출
    const [posts, setPosts] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [nickname, setNickname] = useState('');
    const [points, setPoints] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [activityStats, setActivityStats] = useState({ posts: 0, comments: 0, likes: 0, dislikes: 0 });
    const [visitorCount, setVisitorCount] = useState(0);
    const [visitorDataPoints, setVisitorDataPoints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 10;

    // 사용자 정보 및 프로필 데이터 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get(`/users/${userId}`);
                const userData = userResponse.data;
                setNickname(userData.nickname || '사용자');
                setProfileImage(userData.profileImageUrl || '');
                setPoints(userData.points);
                setFollowingCount(userData.followingCount || 0);
                setFollowerCount(userData.followerCount || 0);
            } catch (error) {
                console.error("사용자 정보 로드 중 오류 발생:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    // 활동 통계 및 방문자 수 데이터 가져오기
    useEffect(() => {
        const fetchActivityAndVisitorData = async () => {
            try {
                const activityResponse = await api.get(`/myhome/activity`);
                const activityData = activityResponse.data;
                setActivityStats({
                    posts: activityData.postCount,
                    comments: activityData.commentCount,
                    likes: activityData.likesReceived,
                    dislikes: activityData.dislikesReceived,
                });

                const visitorResponse = await api.get('/myhome/visitor-count');
                setVisitorCount(visitorResponse.data);
            } catch (error) {
                console.error("통계 및 방문자 데이터 로드 중 오류 발생:", error);
            }
        };

        fetchActivityAndVisitorData();
    }, []);

    // 게시물 가져오기 (페이지네이션 포함)
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await api.get(`/user/${userId}/posts`, {
                    params: {
                        page: currentPage - 1, // 0부터 시작하는 페이지 번호
                        size: itemsPerPage,
                    },
                });
                setPosts(response.data.posts || []);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("게시물 데이터를 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchUserPosts();
    }, [userId, currentPage]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="userhomepost-container">
            {/* 사용자 프로필 및 통계 정보 */}
            <div className="profile-info">
                <img src={profileImage} alt="프로필 사진" className="profile-picture" />
                <span className="nickname">{nickname}</span>
                <p>포인트: {points}</p>
                <div className="follow-info">
                    팔로잉: {followingCount} | 팔로워: {followerCount}
                </div>
            </div>

            {/* 활동 통계 */}
            <div className="activity-stats">
                <h3>활동 통계</h3>
                <p>게시물 수: {activityStats.posts}</p>
                <p>댓글 수: {activityStats.comments}</p>
                <p>좋아요 수: {activityStats.likes}</p>
                <p>싫어요 수: {activityStats.dislikes}</p>
            </div>

            {/* 방문자 통계 */}
            <div className="visitor-stats">
                <h3>방문자 통계</h3>
                <p>총 방문자 수: {visitorCount}</p>
                <p>일일 방문자 수: {visitorDataPoints.join(', ')}</p>
            </div>

            {/* 게시물 리스트 */}
            {posts.map((post) => (
                <div key={post.id} className="userhomepost">
                    <a href={`/postview/${post.id}`} className="userhomepost-title">{post.title}</a>
                    <p className="userhomepost-date">
                        {new Date(post.date).toLocaleDateString()}
                    </p>
                    <div className="userhomepost-content">
                        <p>{post.content.slice(0, 100)}...</p>
                    </div>
                    <div className="userhomepost-stats">
                        <span>👍 {post.likes}</span>
                        <span>👁️ {post.views}</span>
                        <span>💬 {post.commentsCount}</span>
                    </div>
                </div>
            ))}

            {/* 페이지네이션 */}
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    이전
                </button>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default UserMenu;