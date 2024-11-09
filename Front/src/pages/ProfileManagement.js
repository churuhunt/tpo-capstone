import React, { useState, useEffect } from 'react';
import './ProfileManagement.css';
import api from '../axios';

import PageSubMenu from '../components/PageSubMenu'; /*sub*/
import Banner from '../components/Banner';
import banner1 from '../image/ProfileManagementbanner.jpg';

const ProfileManagement = () => {
    const menuItems = ["내 정보 관리"]; /*sub */
    const [activeIndex, setActiveIndex] = useState(null);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState({
        old: '',
        new: ''
    });
    const [blockedAccounts, setBlockedAccounts] = useState([]);
    const [notifications, setNotifications] = useState({
        comments: true,
        replies: true,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBlockedAccount, setNewBlockedAccount] = useState('');

    const [UserAccountId, setUserAccountId] = useState(null); // 사용자 ID 상태 추가


    const toggleNotification = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    useEffect(() => {
        fetchCurrentUser(); // 현재 사용자 정보 조회
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get(`/users/current`); // 현재 사용자 정보를 가져오는 API 호출
            setUsername(response.data.userId); // 사용자 ID 설정
            setUserAccountId(response.data.id); // Long id 설정
            setNickname(response.data.nickname);
            setEmail(response.data.email);
            // 현재 사용자 조회가 성공적으로 이루어진 후 차단된 사용자 조회
            await fetchBlockedUsers();
        } catch (error) {
            console.error('현재 사용자 조회 실패:', error);
        }
    };

    const fetchBlockedUsers = async () => {
        if (UserAccountId) {
            try {
                const response = await api.get(`/settings/blocked?userId=${UserAccountId}`);
                setBlockedAccounts(response.data);
            } catch (error) {
                console.error('차단된 사용자 조회 실패:', error);
            }
        }
    };

    const updateNickname = async () => {
        console.log('Current UserId:', UserAccountId); // userId 값 출력
        if (!UserAccountId) {
            alert('사용자 ID가 없습니다. 다시 로그인해 주세요.');
            return;
        }
        try {
            // userId와 newNickname을 URL의 쿼리 매개변수로 추가
            await api.put(`/settings/nickname?userId=${UserAccountId}&newNickname=${nickname}`);
            alert("닉네임이 변경되었습니다.");
            fetchCurrentUser(); // Refresh to get updated nickname
        } catch (error) {
            console.error('닉네임 변경 실패:', error);
            alert("닉네임 변경에 실패했습니다.");
        }
    };

    const updateEmail = async () => {
        try {
            // userId와 newemail을 URL의 쿼리 매개변수로 추가
            await api.put(`/settings/email?userId=${UserAccountId}&newEmail=${email}`);
            alert("이메일이 변경되었습니다.");
            fetchCurrentUser();
        } catch (error) {
            console.error('이메일 변경 실패:', error);
        }
    };

    const updateUsername = async () => {
        try {
            await api.put(`/settings/userId?userId=${UserAccountId}&newUserId=${username}`);
            alert("아이디가 변경되었습니다.");
            fetchCurrentUser();
        } catch (error) {
            console.error('아이디 변경 실패:', error);
        }
    };

    const updatePassword = async () => {
        if (!UserAccountId) {
            alert('사용자 ID가 없습니다. 다시 로그인해 주세요.');
            return;
        }
        try {
            await api.put(`/settings/password?userId=${UserAccountId}&oldPassword=${password.old}&newPassword=${password.new}`);
            alert("비밀번호가 변경되었습니다.");
            fetchCurrentUser();
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
        }
    };

    const blockUser = async () => {
        if (!UserAccountId) {
            alert('사용자 ID가 없습니다. 다시 로그인해 주세요.');
            return;
        }
        try {
            await api.post(`/settings/block?blockerId=${UserAccountId}&blockedId=${newBlockedAccount}`);
            setBlockedAccounts([...blockedAccounts, { name: newBlockedAccount }]);
            setNewBlockedAccount('');
            alert("사용자가 차단되었습니다.");
        } catch (error) {
            console.error('사용자 차단 실패:', error);
        }
    };

    const unblockUser = async (blockedId) => {
        if (!UserAccountId) {
            alert('사용자 ID가 없습니다. 다시 로그인해 주세요.');
            return;
        }
        try {
            await api.delete(`/settings/unblock?blockerId=${UserAccountId}&blockedId=${blockedId}`);
            setBlockedAccounts(blockedAccounts.filter(account => account.name !== blockedId));
            alert("차단이 해제되었습니다.");
        } catch (error) {
            console.error('차단 해제 실패:', error);
        }
    };

    return (
        <div className="Profile-Management-container1">
            <Banner src={banner1} title="👤내정보관리" />

            <div className="post-form-container"> {/*sub*/}
                <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

                <div className="Profile-Management-container2">
                <div className="Profile-Management-section">
                    <label>닉네임 변경</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="새 닉네임 입력"
                    />
                    <button onClick={updateNickname} disabled={!nickname}>변경</button>
                </div>

                <div className="Profile-Management-section">
                <label>이메일 변경</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="새 이메일 입력"
                    />
                    <button onClick={updateEmail}>변경</button>
                </div>

                <div className="Profile-Management-section">
                    <label>아이디 변경</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="새 아이디 입력"
                    />
                    <button onClick={updateUsername}>변경</button>
                </div>

                <div className="Profile-Management-section">
                <label>비밀번호 변경</label>
                    <input
                        type="password"
                        value={password.old}
                        onChange={(e) => setPassword({...password, old: e.target.value})}
                        placeholder="현재 비밀번호 입력"
                    />
                    <input
                        type="password"
                        value={password.new}
                        onChange={(e) => setPassword({...password, new: e.target.value})}
                        placeholder="새 비밀번호 입력"
                    />
                    <button onClick={updatePassword}>변경</button>
                </div>

                <div className="Profile-Management-section">
                    <h3>차단 내역 관리</h3>
                    <button onClick={() => setIsModalOpen(true)}>열기</button>
                </div>

                <div className="Profile-Management-section">
                    <h3>알림 설정</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={notifications.comments}
                            onChange={() => toggleNotification('comments')}
                        />
                        댓글 알림
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={notifications.replies}
                            onChange={() => toggleNotification('replies')}
                        />
                        대댓글 알림
                    </label>
                </div>

                {isModalOpen && (
                    <div className="Profile-Management-modal">
                        <div className="Profile-Management-modal-content">
                            <h3>차단된 계정 관리</h3>
                            <div className="Profile-Management-blocked-list">
                                {blockedAccounts.map((account, index) => (
                                    <div key={index} className="Profile-Management-blocked-item">
                                        <img src={account.profileImage} alt="Profile"
                                             className="Profile-Management-profile-image"/>
                                        <span>{account.name}</span>
                                        <button onClick={() => unblockUser(account.name)}>해제</button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="차단할 사용자 추가"
                                value={newBlockedAccount}
                                onChange={(e) => setNewBlockedAccount(e.target.value)}
                            />
                            <button onClick={blockUser}>추가</button>
                            <button onClick={() => setIsModalOpen(false)}>닫기</button>
                        </div>
                    </div>
                )}
            </div>
            </div>

        </div>
    );
};

export default ProfileManagement;