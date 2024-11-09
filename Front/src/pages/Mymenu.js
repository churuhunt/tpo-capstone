import React, { useState, useEffect } from 'react';
import './Mymenu.css';
import profileImageSrc from '../image/profile.png';
import Guestbook from '../components/Guestbook';
import PageSubMenu from '../components/PageSubMenu';
import Visithistory from '../components/Visithistory';
import Myhomepost from '../components/Myhomepost';
import ActivityDashboard from '../components/ActivityDashboard';
import LoadingModal from '../components/LoadingModal';
import CustomizationPage from '../components/CustomizationPage';
import FriendList from '../components/FriendList';
import api from '../axios';

import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement);

const MyMenu = () => {
    {/*const menuItems = ["게시물", "방명록", "활동통계", "커스텀", "타임라인", "추천 게시물", "북마크 게시물"];*/}
    const menuItems = ["게시물", "방명록", "활동통계", "커스텀"];

    const [activeIndex, setActiveIndex] = useState(0);
    const [points, setPoints] = useState(0);
    const [profileImage, setProfileImage] = useState(profileImageSrc);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [tempBackgroundImage, setTempBackgroundImage] = useState('');
    const [nickname, setNickname] = useState('');
    const [tempProfileImage, setTempProfileImage] = useState(profileImageSrc);
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
        const fetchData = async () => {
            setLoading(true); // 로딩 시작

            try {
                // 모든 비동기 함수를 병렬로 실행
                await Promise.all([
                    api.get('/myhome/profile').then(response => {
                        const userData = response.data;
                        setProfileImage(userData.profileImageUrl || profileImageSrc);
                        setTempProfileImage(userData.profileImageUrl || profileImageSrc);
                        setBackgroundImage(userData.backgroundImageUrl || '');
                        setTempBackgroundImage(userData.backgroundImageUrl || '');
                        setNicknameDecoration(userData.nicknameDecoration || '');
                        setIntroduction(userData.introduction || '');
                    }),

                    api.get('/users/current').then(response => {
                        const userData = response.data;
                        setNickname(userData.nickname || '사용자');
                        setPoints(userData.points);
                    }),

                    api.get('/myhome/posts').then(response => {
                        setUserPosts(response.data || []);
                    }),

                    api.get('/myhome/activity').then(response => {
                        const fetchedData = response.data;
                        setActivityStats({
                            posts: fetchedData.postCount,
                            comments: fetchedData.commentCount,
                            likes: fetchedData.likesReceived,
                            dislikes: fetchedData.dislikesReceived,
                        });
                    }),

                    api.get('/myhome/visitor-count').then(response => {
                        const totalVisitorCount = response.data;
                        setVisitorCount(totalVisitorCount);
                        setVisitorDataPoints(Array(6).fill(totalVisitorCount));
                    })
                ]);

                // 모든 데이터가 로드된 후 로딩 상태 해제
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await api.put('/myhome/profile', {
                profileImageUrl: tempProfileImage,
                backgroundImageUrl: tempBackgroundImage
            });

            if (response.status === 200) {
                setProfileImage(tempProfileImage);
                setBackgroundImage(tempBackgroundImage);
                alert('저장되었습니다.');
            } else {
                console.error("Unexpected response:", response);
                alert('저장에 실패했습니다. 서버 응답을 확인하세요.');
            }
        } catch (error) {
            console.error("이미지 저장 실패:", error.response || error.message);
            alert('이미지 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTempProfileImage(profileImage);
        setTempBackgroundImage(backgroundImage);
    };

    const handleMenuClick = (item) => {
        if (item === "게시물") {
            setActiveTab('myhomepost');
        } else if (item === "활동통계") {
            setActiveTab('ActivityDashboard');
        } else if (item === "방명록") {
            setActiveTab('guestbook');
        } else if (item === "커스텀") {
            setActiveTab(item === "커스텀" ? "custom" : item.toLowerCase());
        }
    };

    return (
        <div className="my-menu-container">
            {/* 로딩 모달 - 모든 데이터가 로드될 때까지 표시 */}
            {loading && <LoadingModal />}
            {!loading && (
                <>
                    <div className="background-image" style={{ backgroundImage: `url(${tempBackgroundImage || backgroundImage})` }}></div>
                    <div className="profile-info">
                        <img src={tempProfileImage} className="profile-picture" alt="프로필 사진" />
                        <span className="nickname">{nickname}</span>
                        <div className="follow-info">
                            <span onClick={() => setActiveTab('following')} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                팔로잉: {followingCount}
                            </span>
                            |
                            <span onClick={() => setActiveTab('follower')} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                팔로워: {followerCount}
                            </span>
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
                            {activeTab === 'myhomepost' && <Myhomepost posts={userPosts} />}
                            {activeTab === 'ActivityDashboard' && <ActivityDashboard stats={activityStats} />}
                            {activeTab === 'guestbook' && <Guestbook />}
                            {activeTab === 'custom' && (
                                <CustomizationPage
                                    setTempProfileImage={setTempProfileImage}
                                    setTempBackgroundImage={setTempBackgroundImage}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    points={points}
                                />
                            )}
                            {activeTab === 'follower' && <FriendList type="follower" />}
                            {activeTab === 'following' && <FriendList type="following" />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyMenu;
