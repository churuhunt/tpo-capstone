import React, { useState } from 'react';
import './Mymenu.css';
import profileImageSrc from '../image/profile.png';
import Guestbook from '../components/Guestbook';
import PageSubMenu from '../components/PageSubMenu';
import Visithistory from '../components/Visithistory';
import Myhomepost from '../components/Myhomepost';
import ActivityDashboard from '../components/ActivityDashboard';

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
            <div className="background-image">
                <button className="custom-button">커스텀</button>
            </div>
            <div className="profile-info">
                <img src={profileImage} className="profile-picture" alt="프로필 사진" />
                <span className="nickname">사용자 닉네임</span>
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