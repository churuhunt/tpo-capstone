import React, { useState, useEffect } from 'react';
import './FriendList.css';
import api from '../axios';


import homeimg from '../image/Logo2.png';
import profileimg from '../image/profile.png';


const FriendList = () => {
    const [FriendListSearchTerm, setFriendListSearchTerm] = useState('');
    const [FriendListActiveTab, setFriendListActiveTab] = useState('followers');
    const [FriendListFriends, setFriendListFriends] = useState([]);
    const [FriendListFilteredFriends, setFriendListFilteredFriends] = useState([]);

    useEffect(() => {
        // 임시 데이터 설정
        const tempData = FriendListActiveTab === 'followers' ? [
            { id: 1, nickname: '이인하1', profileImage: profileimg },
            { id: 2, nickname: '이인하2', profileImage: profileimg },
            { id: 3, nickname: '이인하3', profileImage: profileimg }
        ] : [
            { id: 4, nickname: '이인하4', profileImage: profileimg },
            { id: 5, nickname: '이인하5', profileImage: profileimg },
            { id: 6, nickname: '이인하6', profileImage: profileimg }
        ];

        setFriendListFriends(tempData);
        setFriendListFilteredFriends(tempData);
    }, [FriendListActiveTab]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await api.get(`/friends/${FriendListActiveTab}`);
                setFriendListFriends(response.data);
                setFriendListFilteredFriends(response.data);
            } catch (error) {
                console.error('친구 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        fetchFriends();
    }, [FriendListActiveTab]);

    useEffect(() => {
        const results = FriendListFriends.filter(friend =>
            friend.nickname.toLowerCase().includes(FriendListSearchTerm.toLowerCase())
        );
        setFriendListFilteredFriends(results);
    }, [FriendListSearchTerm, FriendListFriends]);

    return (
        <div className="FriendList-container">
            <div className="FriendList-header">
                <h2>친구</h2>
                <div className="FriendList-tabs">
                    <button
                        className={FriendListActiveTab === 'followers' ? 'active' : ''}
                        onClick={() => setFriendListActiveTab('followers')}
                    >
                        팔로워
                    </button>
                    <button
                        className={FriendListActiveTab === 'following' ? 'active' : ''}
                        onClick={() => setFriendListActiveTab('following')}
                    >
                        팔로잉
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="🔍 검색"
                    value={FriendListSearchTerm}
                    onChange={(e) => setFriendListSearchTerm(e.target.value)}
                    className="FriendList-search-bar"
                />
            </div>
            <div className="FriendList-list">
                {FriendListFilteredFriends.map(friend => (
                    <div key={friend.id} className="FriendList-item">
                        <img src={friend.profileImage || '/path/to/default-image.png'} alt="프로필" />
                        <span>{friend.nickname}</span>
                        <button className="home-button">
                          <img src={homeimg} alt="홈 아이콘" style={{ width: '40px', height: '40px' }} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;
