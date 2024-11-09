import React, { useState, useEffect } from 'react';
import './Mymenu.css';
import profileImageSrc from '../image/profile.png';
import Guestbook from '../components/Guestbook';
import PageSubMenu from '../components/PageSubMenu';
import Visithistory from '../components/Visithistory';
import Myhomepost from '../components/Myhomepost';
import ActivityDashboard from '../components/ActivityDashboard';
import LoadingModal from '../components/LoadingModal';
import api from '../axios';

import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement);

const MyMenu = () => {
    const menuItems = ["게시물", "방명록", "활동통계", "타임라인", "추천 게시물", "북마크 게시물"];
    const [activeIndex, setActiveIndex] = useState(0);
    const [profileImage, setProfileImage] = useState(profileImageSrc);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [nickname, setNickname] = useState('');
    const [nicknameDecoration, setNicknameDecoration] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [activeTab, setActiveTab] = useState('myhomepost');
    const [followingCount, setFollowingCount] = useState(120);
    const [followerCount, setFollowerCount] = useState(250);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [userPosts, setUserPosts] = useState([]); // Store posts here
    const [activityStats, setActivityStats] = useState({ posts: 0, comments: 0, likes: 0, dislikes: 0 });
    const [visitorCount, setVisitorCount] = useState(0);
    const [visitorDataPoints, setVisitorDataPoints] = useState([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true); // 로딩 시작
            try {
                const response = await api.get('/myhome/profile');
                const userData = response.data;
                setProfileImage(userData.profileImageUrl || profileImageSrc);
                setBackgroundImage(userData.backgroundImageUrl || '');
                setNicknameDecoration(userData.nicknameDecoration || '');
                setIntroduction(userData.introduction || '');
            } catch (error) {
                console.error("프로필 데이터를 가져오지 못했습니다.", error);
            }
        };

        const fetchUserNickname = async () => {
            try {
                const response = await api.get('/users/current');
                const userData = response.data;
                setNickname(userData.nickname || '사용자');
            } catch (error) {
                console.error("Failed to fetch user nickname", error);
            } finally{
                setLoading(false); // 로딩 종료
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await api.get('/myhome/posts');
                setUserPosts(response.data || []);
            } catch (error) {
                console.error("게시물을 불러오는 중 오류가 발생했습니다.", error);
            }
        };

        // 서버에서 활동 통계 가져오기
        const fetchStats = async () => {
            try {
                const response = await api.get('/myhome/activity');
                const fetchedData = response.data;
                console.log("Fetched stats:", response.data); // 데이터 확인
                // 상태와 매핑되는 속성 이름으로 변환
                setActivityStats({
                    posts: fetchedData.postCount,
                    comments: fetchedData.commentCount,
                    likes: fetchedData.likesReceived,
                    dislikes: fetchedData.dislikesReceived,
                });
            } catch (error) {
                console.error('활동 통계 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        const fetchVisitorData = async () => {
            try {
                const response = await api.get('/myhome/visitor-count');
                const totalVisitorCount = response.data;
                setVisitorCount(totalVisitorCount);
                const data = Array(6).fill(totalVisitorCount);
                setVisitorDataPoints(data);
            } catch (error) {
                console.error("Error fetching visitor count:", error);
                setVisitorDataPoints([0, 0, 0, 0, 0, 0]);
            }
        };


        fetchStats();
        fetchProfileData();
        fetchUserNickname();
        fetchUserPosts(); // Fetch posts initially here
        fetchVisitorData();
    }, []);

    const handleMenuClick = (item) => {
        if (item === "게시물") {
            setActiveTab('myhomepost');
        } else if (item === "활동통계") {
            setActiveTab('ActivityDashboard');
        } else if (item === "방명록") {
            setActiveTab('guestbook');
        }
    };

    return (
        <div className="my-menu-container">
            {/* 로딩 */}
            {loading && <LoadingModal />}
            <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <button className="custom-button">커스텀</button>
            </div>
            <div className="profile-info">
                <img src={profileImage} className="profile-picture" alt="프로필 사진" />
                <span className="nickname">{nickname}</span>
                <div className="follow-info">
                    <span>팔로잉: {followingCount}</span> | <span>팔로워: {followerCount}</span>
                </div>
            </div>
            <div className="my-menu-submenu1">
                <div className="my-menu-submenu">
                    <PageSubMenu
                        items={menuItems}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        onItemClick={handleMenuClick}
                    />
                </div>
            </div>
            <div className="my-menu-content">
                <div className="my-menu-content1">
                    <Visithistory visitorCount={visitorCount} visitorDataPoints={visitorDataPoints} />
                </div>
                <div className="my-menu-content2">
                    {activeTab === 'myhomepost' && <Myhomepost posts={userPosts} />} {/* Pass posts here */}
                    {activeTab === 'ActivityDashboard' && <ActivityDashboard stats={activityStats} />}
                    {activeTab === 'guestbook' && <Guestbook />}
                </div>
            </div>
        </div>
    );
};

export default MyMenu;
