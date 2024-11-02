import React, { useState } from 'react';
import './ProfileManagement.css';

import PageSubMenu from '../components/PageSubMenu'; /*sub*/
import Banner from '../components/Banner';
import banner1 from '../image/ProfileManagementbanner.jpg';

const ProfileManagement = () => {
    const menuItems = ["내 정보 관리"]; /*sub */
    const [activeIndex, setActiveIndex] = useState(null);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [blockedAccounts, setBlockedAccounts] = useState([
        { name: 'user1', profileImage: 'https://i.namu.wiki/i/AqqP_0SvJeN-Ho3VwvnVlUP9uFxZUHOIAqjQpnc6L5JYjdv4p5am1Q7UEy67RUY9VNSIgdWPfbgQF6vGmZcBJw.gif' },
        { name: 'user2', profileImage: 'https://i.makeagif.com/media/7-30-2021/Ud8Kii.gif' },
        { name: 'user3', profileImage: 'https://i.namu.wiki/i/t7F8pzHw36_DxvmZD7h39NuCJYqXKZowmyvvO29Ng4DOY3jrnGRwWZUE1oCtyF2HNPHrxAENVfx9Nc8SG5ajJQ.gif' },
        { name: 'user4', profileImage: 'https://item.kakaocdn.net/do/5cabf3cc8b2e3541e9f652f06b25b1c6f43ad912ad8dd55b04db6a64cddaf76d' },
        { name: 'user5', profileImage: 'https://i.namu.wiki/i/U_e54VGxcjBX4usL4co3vPE4n4tp0DwS-BvcyASuvP5lnco0NMFdJ0EeUgp9Uo4RDb68QlpgeysA3AyWsVfV5A.gif' },
        { name: 'user6', profileImage: 'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfODEg/MDAxNjA2OTYwMTMwMDIz.CH0wwi3vq1NRbCMo4vSD2DxwqUjWhLAfGK3vs_HYAVMg.ew3TvMIDK86UJADD7363U3K2eQwi4TOwoG__QRwLgCUg.GIF.bidsh/01.gif?type=w800' }
    ]); // 예시 데이터
    const [notifications, setNotifications] = useState({
        comments: true,
        replies: true,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBlockedAccount, setNewBlockedAccount] = useState('');

    const handleNicknameChange = (e) => setNickname(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const toggleNotification = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleUnblock = (account) => {
        setBlockedAccounts(blockedAccounts.filter((user) => user.name !== account));
    };

    const handleAddBlockedAccount = () => {
        if (newBlockedAccount && !blockedAccounts.some(user => user.name === newBlockedAccount)) {
            setBlockedAccounts([...blockedAccounts, { name: newBlockedAccount, profileImage: 'http://localhost:3000/static/media/profile.56d6b32a5ad4953cfffa.png' }]);
            setNewBlockedAccount('');
        }
    };

    return (
        <div className="Profile-Management-container1">
            <Banner src={banner1} title="👤내정보관리" />
            
            <div className="post-form-container"> {/*sub*/}
                <PageSubMenu items={menuItems} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            </div>
            <div className="Profile-Management-container2">
                <div className="Profile-Management-section">
                    <label>닉네임 변경</label>
                    <input 
                        type="text" 
                        value={nickname} 
                        onChange={handleNicknameChange} 
                        placeholder="새 닉네임 입력" 
                    />
                    <button>변경</button>
                </div>

                <div className="Profile-Management-section">
                    <label>이메일 변경</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        placeholder="새 이메일 입력" 
                    />
                    <button>변경</button>
                </div>

                <div className="Profile-Management-section">
                    <label>아이디 변경</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={handleUsernameChange} 
                        placeholder="새 아이디 입력" 
                    />
                    <button>변경</button>
                </div>

                <div className="Profile-Management-section">
                    <label>비밀번호 변경</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={handlePasswordChange} 
                        placeholder="새 비밀번호 입력" 
                    />
                    <button>변경</button>
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
                                        <img src={account.profileImage} alt="Profile" className="Profile-Management-profile-image" />
                                        <span>{account.name}</span>
                                        <button onClick={() => handleUnblock(account.name)}>해제</button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="차단할 사용자 추가"
                                value={newBlockedAccount}
                                onChange={(e) => setNewBlockedAccount(e.target.value)}
                            />
                            <button onClick={handleAddBlockedAccount}>추가</button>
                            <button onClick={() => setIsModalOpen(false)}>닫기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileManagement;
