import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from "./Login";

const Signup = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const navigate = useNavigate();

  const handleUserIdCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/check-userId?userId=${userId}`);
      if (response.status === 200) {
        alert("사용 가능한 아이디입니다.");
        setIsUserIdChecked(true);
      }
    } catch (error) {
      alert("이미 사용 중인 아이디입니다.");
      setIsUserIdChecked(false);
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/check-nickname?nickname=${nickname}`);
      if (response.status === 200) {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      }
    } catch (error) {
      alert("이미 사용 중인 닉네임입니다.");
      setIsNicknameChecked(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isUserIdChecked) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    if (!isNicknameChecked) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup', {
        userId,
        password,
        name,
        nickname,
      });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    }
  };


  const handleLogin = () => {
    navigate('/login');  // '/signup' 경로로 이동
  };

  const openSignUp = () => {
    navigate('/signup');  // '/signup' 경로로 이동
  };



  return (
      <div className='Login-page-container1'> {/* 최상위 배경 컨테이너 */}
        <div className="Login-page-container2"> {/* 로그인 박스 */}
          <div className={`Login-page-overlay ${isSignUp ? 'Login-page-open-sign-up' : 'Login-page-open-sign-in'}`}>

            <div className="Login-page-sign-in">
              <h1>TPO 회원가입</h1>
              <p>Time Place Occasion</p>
              <button className="Login-page-switch-button" onClick={handleLogin}>로그인</button>
            </div>

            <div className="Login-page-sign-up">
              <h1>TPO 로그인</h1>
              <p>Time Place Occasion</p>
              <button className="Login-page-switch-button" onClick={openSignUp}>회원가입</button>
            </div>
          </div>

          <div className="Login-page-form">
            <div className={`Login-page-sign-in ${isSignUp ? 'Login-page-form-left-slide-out' : 'Login-page-form-left-slide-in'}`} style={{ display: isSignUp ? 'none' : 'flex' }}>
              <h1>로그인</h1>
              <div className="Login-page-social-media-buttons">
                <div className="Login-page-icon">
                  <svg viewBox="0 0 24 24">
                    <path fill="#000000" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
                  </svg>
                </div>

                <div className="Login-page-icon">
                  <svg viewBox="0 0 24 24">
                    <path fill="#000000" d="M23,11H21V9H19V11H17V13H19V15H21V13H23M8,11V13.4H12C11.8,14.4 10.8,16.4 8,16.4C5.6,16.4 3.7,14.4 3.7,12C3.7,9.6 5.6,7.6 8,7.6C9.4,7.6 10.3,8.2 10.8,8.7L12.7,6.9C11.5,5.7 9.9,5 8,5C4.1,5 1,8.1 1,12C1,15.9 4.1,19 8,19C12,19 14.7,16.2 14.7,12.2C14.7,11.7 14.7,11.4 14.6,11H8Z" />
                  </svg>
                </div>

                <div className="Login-page-icon">
                  <svg viewBox="0 0 24 24">
                    <path fill="#000000" d="M21,21H17V14.25C17,13.19 15.81,12.31 14.75,12.31C13.69,12.31 13,13.19 13,14.25V21H9V9H13V11C13.66,9.93 15.36,9.24 16.5,9.24C19,9.24 21,11.28 21,13.75V21M7,21H3V9H7V21M5,3A2,2 0 0,1 7,5A2,2 0 0,1 5,7A2,2 0 0,1 3,5A2,2 0 0,1 5,3Z" />
                  </svg>
                </div>

              </div>
            </div>

            <div
                className={`Login-page-sign-up ${isSignUp ? 'Login-page-form-right-slide-in' : 'Login-page-form-right-slide-out'}`}
                style={{display: isSignUp ? 'flex' : 'none'}}>
              <h1>회원가입</h1>
              <form id="Login-page-sign-up-form">
                <input
                    type="text"
                    id="userId"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <button className="Sign-up-page-button1" type="button" onClick={handleUserIdCheck}>중복확인</button>

                <input
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <input
                    type="text"
                    id="name"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />


              <div className='btndiv'>
                <input
                    type="text"
                    placeholder="닉네임"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <button className="Sign-up-page-button2" type="button" onClick={handleNicknameCheck}>중복확인</button>
              </div>

              <button className="Login-page-control-button Login-page-up" onClick={handleSignup}>가입하기</button>
            </form>
          </div>
        </div>
      </div>
      </div>

  );
};

export default Signup;
