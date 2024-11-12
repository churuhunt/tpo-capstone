import React, { useState, useEffect } from 'react';
import './Mymenu.css';
import { useParams } from 'react-router-dom';
import profileImageSrc from '../image/profile.png';
import Guestbook from '../components/Guestbook';
import PageSubMenu from '../components/PageSubMenu';
import Visithistory from '../components/Visithistory';
import Myhomepost from '../components/Myhomepost';
import ActivityDashboard from '../components/ActivityDashboard';
import LoadingModal from '../components/LoadingModal';
import CustomizationPage from '../components/CustomizationPage';
import ProfileDec from '../components/ProfileDec';
import FriendList from '../components/FriendList';
import api from '../axios';

import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement);

const MyMenu = () => {
    const { userId: paramUserId } = useParams();
    const [menuItems, setMenuItems] = useState(["게시물", "방명록", "활동통계", "커스텀"]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [points, setPoints] = useState(0);
    const [profileImage, setProfileImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [tempProfileImage, setTempProfileImage] = useState(null);
    const [tempBackgroundImage, setTempBackgroundImage] = useState(null);
    const [nickname, setNickname] = useState('');
    const [nicknameDecoration, setNicknameDecoration] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [activeTab, setActiveTab] = useState('myhomepost');
    const [followingCount, setFollowingCount] = useState(120);
    const [followerCount, setFollowerCount] = useState(250);
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [activityStats, setActivityStats] = useState({ posts: 0, comments: 0, likes: 0, dislikes: 0 });
    const [visitorCount, setVisitorCount] = useState(0);
    const [visitorDataPoints, setVisitorDataPoints] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [decId, setDecId] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 사용자 정보 및 ID 가져오기
            const userResponse = await api.get('/users/current');
            const currentUserData = userResponse.data;
            setLoggedInUserId(currentUserData.id);

            const response = await api.get(paramUserId ? `/users/${paramUserId}` : '/users/current');
            const userData = response.data;
            setNickname(userData.nickname || '사용자');
            setPoints(userData.points);
            setCurrentUserId(response.data.id);

            if (paramUserId !== currentUserData.id.toString()) {
                setMenuItems(["게시물", "방명록", "활동통계"]);
            }

            await Promise.all([
                api.get(paramUserId ? `/myhome/profile/${paramUserId}` : '/myhome/profile').then(response => {
                    const userData = response.data;
                    setProfileImage(userData.profileImageUrl || '');
                    setTempProfileImage(userData.profileImageUrl || '');
                    setBackgroundImage(userData.backgroundImageUrl || '');
                    setTempBackgroundImage(userData.backgroundImageUrl || '');
                    setNicknameDecoration(userData.nicknameDecoration || '');
                    setIntroduction(userData.introduction || '');
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

            // 게시물 가져오기 함수 호출
            fetchPosts(userData.id);
        } catch (error) {
            console.error("데이터 로드 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 게시물 가져오기 함수
    const fetchPosts = async (userId) => {
        try {
            setLoading(true);
            const response = await api.get('/posts', {
                params: {
                    userId,
                },
                paramsSerializer: params => {
                    return Object.keys(params)
                        .map(key => Array.isArray(params[key]) ? params[key].map(val => `${key}=${val}`).join('&') : `${key}=${params[key]}`)
                        .join('&');
                }
            });
            setUserPosts(response.data.posts || []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('게시물 데이터를 가져오는 데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };
    const updateProfileImageUrl = async (imageUrl) => {
        await api.post('/myhome/update-profile-url', { imageUrl });
    };

    const updateBackgroundImageUrl = async (imageUrl) => {
        await api.post('/myhome/update-background-url', { imageUrl });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // URL 저장 요청
            if (typeof tempProfileImage === 'string') {
                await updateProfileImageUrl(tempProfileImage);
                setProfileImage(tempProfileImage);
            } else if (tempProfileImage instanceof File) {
                // 파일 업로드 요청
                const formData = new FormData();
                formData.append('file', tempProfileImage);
                const response = await api.post('/api/myhome/profile/upload-profile-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProfileImage(response.data);
            }

            if (typeof tempBackgroundImage === 'string') {
                await updateBackgroundImageUrl(tempBackgroundImage);
                setBackgroundImage(tempBackgroundImage);
            } else if (tempBackgroundImage instanceof File) {
                const formData = new FormData();
                formData.append('file', tempBackgroundImage);
                const response = await api.post('/api/myhome/profile/upload-background-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setBackgroundImage(response.data);
            }

            alert('저장되었습니다.');
        } catch (error) {
            console.error("이미지 저장 실패:", error);
            alert('이미지 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

const handleSaveClick = async () => {
    setLoading(true);
    try {
        // 소개글 저장 요청
        if (introduction) {
            await api.post('/myhome/update-introduction', { introduction }, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        alert('저장되었습니다.');
    } catch (error) {
        console.error("저장 실패:", error);
        alert('저장에 실패했습니다.');
    } finally {
        setLoading(false);
    }
};

    // 포인트 차감 함수
    const updatePoints = (amount) => {
        setPoints(prevPoints => prevPoints - amount);
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
            setActiveTab("custom");
        }
    };


    return (
        <div className="my-menu-container">
            {/* 로딩 모달 - 모든 데이터가 로드될 때까지 표시 */}
            {loading && <LoadingModal />}
            {!loading && (
                <>
                    <div className="background-image" style={{ backgroundImage: `url(${tempBackgroundImage || backgroundImage || "https://mblogthumb-phinf.pstatic.net/MjAxODAzMTFfMjU1/MDAxNTIwNzMyNzIzNzU0.r1JTCWNwtluFmL3NWdESziciZuyHzRi2T59CmVKPh7Mg.3pVF4jNFRCLJLUr89Z2ma3dL7prKPuNU8YjIHrduMGgg.PNG.osy2201/1.png?type=w800"})` }}></div>
                    <div className="profile-info">


                    <ProfileDec decId={decId} />


                        <img src={tempProfileImage || profileImage || profileImageSrc} className="profile-picture" alt="프로필 사진" onError={(e) => e.target.src = profileImageSrc} />
                        <span className="nickname">{nickname}</span>
                        <div className="follow-info">
                            <span onClick={() => setActiveTab('following')}
                                  style={{cursor: 'pointer', textDecoration: 'none'}}>
                                팔로잉: {followingCount}
                            </span>
                            |
                            <span onClick={() => setActiveTab('follower')}
                                  style={{cursor: 'pointer', textDecoration: 'none'}}>
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
                            <Visithistory visitorCount={visitorCount} visitorDataPoints={visitorDataPoints} introduction={introduction} onSaveIntroduction={handleSaveClick} isEditable={paramUserId === loggedInUserId.toString()} />
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
                                    updatePoints={setPoints} // 로컬 포인트 업데이트 함수
                                    userId={paramUserId}
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
