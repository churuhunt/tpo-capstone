import React, { useState, useEffect  } from 'react';
import './Mymenu.css';
import profileImageSrc from '../image/profile.png';
import Guestbook from '../components/Guestbook';
import PageSubMenu from '../components/PageSubMenu';
import Visithistory from '../components/Visithistory';
import Myhomepost from '../components/Myhomepost';
import ActivityDashboard from '../components/ActivityDashboard';
import api from '../axios'

import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement);

const MyMenu = () => {
    const menuItems = ["게시물", "방명록", "활동통계", "타임라인", "추천 게시물", "북마크 게시물"];
    const [activeIndex, setActiveIndex] = useState(null);
    const [profileImage, setProfileImage] = useState(profileImageSrc);
    const [activeTab, setActiveTab] = useState('ActivityDashboard');
    const [followingCount, setFollowingCount] = useState(120); // 팔로잉 수
    const [followerCount, setFollowerCount] = useState(250); // 팔로워 수
    const [nickname, setNickname] = useState('')


    useEffect(() => {
        // 백엔드에서 프로필 데이터 가져오기
        const fetchProfileData = async () => {
            try {
                const response = await api.get('/myhome/profile'); // API 엔드포인트에 맞게 수정
                const userData = response.data;
                setProfileImage(userData.profileImage || profileImageSrc); // 가져온 이미지 설정 또는 기본 이미지 사용
            } catch (error) {
                console.error("프로필 데이터를 가져오지 못했습니다.", error);
            }
        };

        // Fetch nickname of the current user
        const fetchUserNickname = async () => {
            try {
                const response = await api.get('/users/current'); // Adjust if necessary
                const userData = response.data;
                setNickname(userData.nickname || '사용자'); // Use fetched nickname or a default value
            } catch (error) {
                console.error("Failed to fetch user nickname", error);
            }
        };

        fetchProfileData();
        fetchUserNickname();
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

 /*   // 팔로우 요청 함수
    const handleFollow = async () => {
        try {
            const response = await api.post('/follow/follow', null, {
                params: { followingId: 1 } // followingId는 팔로우할 사용자 ID로 설정
            });
            if (response.status === 200) {
                setIsFollowing(true);
                setFollowerCount(followerCount + 1);
            }
        } catch (error) {
            console.error('팔로우 실패:', error);
        }
    };

    // 언팔로우 요청 함수
    const handleUnfollow = async () => {
        try {
            const response = await api.delete('/follow/unfollow', {
                params: { followingId: 1 } // 언팔로우할 사용자 ID
            });
            if (response.status === 200) {
                setIsFollowing(false);
                setFollowerCount(followerCount - 1);
            }
        } catch (error) {
            console.error('언팔로우 실패:', error);
        }
    };*/



    return (
        <div className="my-menu-container">
            <div className="background-image">
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
                    <Visithistory />
                </div>
                <div className="my-menu-content2">
                    {activeTab === 'myhomepost' && <Myhomepost />}
                    {activeTab === 'ActivityDashboard' && <ActivityDashboard />}
                    {activeTab === 'guestbook' && <Guestbook />}
                </div>
            </div>
        </div>
    );
}

export default MyMenu;