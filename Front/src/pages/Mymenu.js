import React, { useState } from 'react';
import './Mymenu.css';
import profileImageSrc from '../image/profile.png';
import ActivityLog from '../components/ActivityLog';
import Guestbook from '../components/Guestbook';
import api from '../axios';  // axios를 통해 API 요청을 보낼 것입니다.

const MyMenu = () => {
    const [profileImage, setProfileImage] = useState(profileImageSrc);
    const [activeTab, setActiveTab] = useState('activity');
    const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태
    const [followingCount, setFollowingCount] = useState(0); // 팔로잉 수
    const [followerCount, setFollowerCount] = useState(0); // 팔로워 수

    // 팔로우 요청 함수
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
    };

    return (
        <div className="my-menu-container">
            <div className="background-image">
                <button className="custom-button">커스텀</button>
            </div>
            <div className="profile-info">
                <img src={profileImage} className="profile-picture" alt="프로필 사진" />
                <span className="nickname">사용자 닉네임</span>
            </div>
            <div className="my-menu-follow">
                <span className="nickname">팔로워: {followerCount}</span>
                <span className="nickname">팔로잉: {followingCount}</span>
            </div>
            <button onClick={isFollowing ? handleUnfollow : handleFollow} className="follow-button">
                {isFollowing ? '언팔로우' : '팔로우'}
            </button>
            <div className="aa">
                {activeTab === 'activity' && <ActivityLog />}
                {activeTab === 'guestbook' && <Guestbook />}
            </div>
            <div className="button-container">
                <button className="button1" onClick={() => setActiveTab('activity')}>게시물</button>
                <button className="button2" onClick={() => setActiveTab('guestbook')}>방명록</button>
            </div>
        </div>
    );
}

export default MyMenu;