import React, { useState } from 'react';
import './Mymenu.css';
import profileImageSrc from '../image/profile.png';
import ActivityLog from '../components/ActivityLog'; 
import Guestbook from '../components/Guestbook'; 
const MyMenu = () => {
    const [profileImage, setProfileImage] = useState(profileImageSrc);
    const [activeTab, setActiveTab] = useState('activity');

    return (
        <div className="my-menu-container">
            <div className="background-image">
                <button className="custom-button">커스텀</button>
            </div>
            <div className="profile-info">
                <img src={profileImage} className="profile-picture" alt="프로필 사진" />
                <span className="nickname">사용자 닉네임</span>
            </div>
            <div className="aa">
                {activeTab === 'activity' && <ActivityLog />}
                {activeTab === 'guestbook' && <Guestbook />}
            </div>
            <div className="button-container">
                <button className="button1" onClick={() => setActiveTab('activity')}>활동내역</button>
                <button className="button2" onClick={() => setActiveTab('guestbook')}>방명록</button>
            </div>
        </div>
    );
}

export default MyMenu;
